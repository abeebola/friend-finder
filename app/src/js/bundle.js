var $ = require('jQuery'),
    getStartedBtn = $('.start a'),
    backBtn = $('.backButton'),
    startText = $('.w-text'),
    startBox = $('.startBox');

getStartedBtn.click(function (e) {
    e.preventDefault();
    startText.addClass('slide-left');
    setTimeout(function () {
        startText.hide().removeClass('slide-left');
        $('.startBox').fadeIn(300);
    }, 600);
});

backBtn.click(function () {
    startBox.addClass('slide-down');
    setTimeout(function () {
        startBox.hide().removeClass('slide-down');
        startText.fadeIn(400);
    }, 600);
});

const splitVals = (str) => {
    var str = str.split(',');
    str.map((item, index) => {
        str[index] = item.trim();
    });
    return str;
}

const stringifyIt = (arrayOrObj, key) => {
    var tempArr = [];
    if (Array.isArray(arrayOrObj)) { // If this is an array...
        arrayOrObj.map((item) => {
            tempArr.push(`${key}=${item}`);
        });

        return tempArr.join('&');
    }

    $.each(arrayOrObj, function (k, v) {
        tempArr.push(`${k}=${v}`);
    });

    return tempArr.join('&');

}

const toggleSpinner = (btn) => {
    var txt = btn.find('.txt'),
        spin = btn.find('.log-spin');
    txt.toggleClass('s');
    spin.toggleClass('s');
}

var prefForm = $('#pref-form'),
    proForm = $('#profileBox > form'),
    prefBtn = proForm.find('button').eq(0);

prefForm.on('submit', function (e) {
    e.preventDefault();
    var prefs = {};
    $('[data-pref]').each(function () {
        var val = $(this).val(),
            pref = $(this).attr('data-pref');
        if (val != "") {
            prefs[pref] = val;
        }
    });

    if ('hobbies' in prefs)
        prefs.hobbies = splitVals(prefs.hobbies.toLowerCase());

    if ('age' in prefs)
        prefs.age = parseInt(prefs.age);

    var prefsJson = JSON.stringify(prefs)

    // Check if object is empty
    if (prefsJson == '{}')
        return alert('Please select at least one preference.');

    // Save preferences to local storage
    localStorage.setItem('user_prefs', prefsJson);

    // Navigate user to profile page
    document.location += 'you';

});

proForm.on('submit', function (e) {
    var form = $(this);
    e.preventDefault();
    toggleSpinner(prefBtn);
    var prefs = {};
    $(this).find('[data-pref]')
        .each(function () {
            var val = $(this).val(),
                pref = $(this).attr('data-pref');
            if (val != "") {
                prefs[pref] = val;
            }
        });

    var userPrefs = localStorage.getItem('user_prefs'),
        userPrefsObj = JSON.parse(userPrefs);

    // Convert prefs object into url-form-encoded string format
    var prefs_data = [];
    $.each(prefs, function (key, val) {
        if (key == 'hobbies') {
            var h = prefs[key].toLowerCase();
            prefs_data.push(stringifyIt(splitVals(h), 'hobbies'));
        } else {
            prefs_data.push(`${key}=${val}`);
        }
    });
    // Append user preferences
    prefs_data.push(`preferences=${userPrefs}`);

    console.log(prefs_data.join('&'));

    $.ajax({

        type: "POST",
        url: form.attr('action'),
        dataType: 'json',
        data: encodeURI(prefs_data.join('&')),
        cache: false,
        contentType: 'application/x-www-form-urlencoded'

    }).done(function (msg) {
        console.log(msg);

        if (msg.statusCode != 1)
            return alert('An error occurred. Please try again later.');

        // Save user's ID
        localStorage.setItem('userId', msg.userId);

        // Refresh page.
        document.location += '/friends';

    }).fail(function (xhr, status, error) {

        if (xhr.status == 0) alert('Network error. Please confirm that you are connected to the internet');
        if (xhr.status.toString().match(/^5\d{2}$/)) alert('Error occurred. Please try again later.');

    }).always(function () {
        toggleSpinner(prefBtn);
    });
});