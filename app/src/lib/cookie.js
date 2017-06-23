const cookie = {

    setExpiry: function(seconds)
    {
        var curr_date = new Date().getUTCMilliseconds();
        return new Date( ( curr_date / 1000 ) + seconds ).toUTCString();
    }
};

module.exports = cookie;