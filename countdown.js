/**
 * @author Yuki Inazuma
 * Feb 2018
 */
(function($) {
    var countdown = {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        tParam = '5m0s',
        counter;

    /**
     * Simply displays and pads countdown.
     */
    function displayCountdown() {
        $('#countdown-hours').text(countdown.hours.toString().padStart(2, '0'));
        $('#countdown-minutes').text(countdown.minutes.toString().padStart(2, '0'));
        $('#countdown-seconds').text(countdown.seconds.toString().padStart(2, '0'));
    };
    
    /**
     * Main timer func. Handles timer reduction itself and kicks off display.
     */
    function timer() {
        // Timer reduction flow/logic.
        if (countdown.seconds < 1 && (countdown.minutes > 0 || countdown.hours > 0)) {
            if (countdown.minutes < 1 && countdown.hours > 0) {
                countdown.hours--;
                
                countdown.minutes = 59;
            } else {
                countdown.minutes--;
            }
            
            countdown.seconds = 59;
        } else {
            countdown.seconds--;
        }
        
        // Stop using processing power on nothing...
        if (isCountdownOver()) {
         clearInterval(counter);
        }

        displayCountdown();
    };
    
    /**
     * Get a particular parameter name and value from the url query string.
     * 
     * Returns string
     */
    function getUrlParameter(sParam, defaultVal) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
        
        if (defaultVal || defaultVal === 0) {
            return defaultVal;
        }
    };
    
    /**
     * Take seconds and/or minutes in excess of 59 and calculates
     * Hours:Minutes:Seconds format.
     * 
     * Returns countdown obj
     */
    function calculateHms(seconds, minutes) {
        if (!seconds || isNaN(seconds)) {
            seconds = 0;
        }
        
        if (!minutes || isNaN(minutes)) {
            minutes = 0;
        }
        
        var hours = 0;
        
        // Need to be able to perform math operations on data.
        seconds = parseInt(seconds);
        minutes = parseInt(minutes);
        
        if (seconds > 59) {
            minutes = minutes + Math.floor(seconds / 60);
            
            // Get the left-over seconds.
            seconds = seconds % 60;
        }
        
        if (minutes > 59) {
            hours = hours + Math.floor(minutes / 60);
            
            // Get the left-over minutes.
            minutes = minutes % 60;
        }
        
        return {
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    };
    
    /**
     * Setter method for countdown obj.
     */
    function setCountdown(hms) {
        if (!hms || (!hms.hasOwnProperty('hours') && !hms.hasOwnProperty('minutes') && !hms.hasOwnProperty('seconds'))) {
            return;
        }
        
        if (!hms.hasOwnProperty('hours')) {
            hms.hours = 0;
        }
        
        if (!hms.hasOwnProperty('minutes')) {
            hms.minutes = 0;
        }
        
        if (!hms.hasOwnProperty('seconds')) {
            hms.seconds = 0;
        }
        
        countdown = hms;
    };
    
    /**
     * Check if the countdown has ended.
     * 
     * Returns bool
     */
    function isCountdownOver() {
        if (countdown.seconds == 0
                && countdown.minutes == 0
                && countdown.hours == 0) {
            return true;
        }
        
        return false;
    };
    
    /**
     * Add properties of hms to properties of countdown and return resulting object.
     * 
     * Returns countdown obj
     */
    function addHmsToCountdown(hms) {
        if (!hms) {
            return countdown;
        }
        
        return {
            hours: countdown.hours + hms.hours,
            minutes: countdown.minutes + hms.minutes,
            seconds: countdown.seconds + hms.seconds
        };
    };
    
    /**
     * Runs input through formatting.
     * 
     * Returns countdown obj
     */
    function convertInputToHms(timeString) {
        // Split value taken from left side of split.
        var splitValue,
            splitResponse,
            hms = {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            formattedHms,
        // Order matters here. Must match splitSeparators order.
            splitPropNames = ['hours','minutes','seconds'],
        // Initialize split separator array.
            splitSeparators = ['h','m','s'],
            separatorsLength = splitSeparators.length;
        
        for (i = 0; i < separatorsLength; i++) {
            splitResponse = timeString.split(splitSeparators[i]);
            
            splitValue = splitResponse[0]; // "Left" side
            timeString = splitResponse[1]; // "Right" side
            
            // If left side of split is numeric value assume that the split separator value 
            // was in the string. Must check this BEFORE parsing to int because of how the 
            // parseInt() function behaves when a string STARTS with a number.
            if (!isNaN(splitValue)) {
                hms[splitPropNames[i]] = parseInt(splitValue);
                
            // This covers a strange case where timeString was undefined if a previous time type was
            // not passed in through the input string.
            } else {
                timeString = splitValue;
            }
        }
        
        // Handle sec/min past 59.
        formattedHms = calculateHms(hms.seconds, hms.minutes);
        hms.hours += formattedHms.hours;
        hms.minutes = formattedHms.minutes;
        hms.seconds = formattedHms.seconds;
        
        return hms;
    };
    
    /**
     * Initialize this process.
     */
    function init() {
        setCountdown(addHmsToCountdown(convertInputToHms(getUrlParameter('t', tParam))));
        
        displayCountdown();
        
        counter = setInterval(timer, 1000);
    };
    
    
    
    
    
    /**
     * Assumes we're looking for sub-day level times (Hours-Minutes-Seconds). Makes the
     * conversion simpler... always multiply by 60 xD
     * 
     * This is now pretty useless thanks to my descovery that keeping the time in H:M:S format saves
     * processing power in the long run. I do need to split the times out tho... that should be done in
     * another function.
     */
    function convertInputToSeconds(countdownAmount) {
        // Protection...
        if (!countdownAmount) {
            return 0;
        }
        
        // Assume it's just seconds and give it back xP
        if (!isNaN(parseInt(countdownAmount))) {
            return parseInt(countdownAmount);
        }
        
        // This time type progresses as you would expect: H > M > S
        var aggregatedAmount = 0,
        // Split value taken from left side of split.
            splitValue,
            splitResponse,
        // Initialize split separator array.
            splitSeparators = ['h','m','s'],
            separatorsLength = splitSeparators.length;
        
        for (i = 0; i < separatorsLength; i++) {
            splitResponse = countdownAmount.split(splitSeparators[i]);
            
            splitValue = splitResponse[0]; // "Left" side
            countdownAmount = splitResponse[1]; // "Right" side
            
            // If left side of split is numeric value assume that the split separator value 
            // was in the string. Must check this BEFORE parsing to int because of how the 
            // parseInt() function behaves when a string STARTS with a number.
            if (!isNaN(splitValue)) {
                splitValue = parseInt(splitValue);
                
                // Multiply first to convert from previous time level to current. Doing this
                // now avoids a decision later for whether to multiply or not.
                aggregatedAmount = aggregatedAmount * 60 + splitValue;
            }
        }
        
        return aggregatedAmount;
    };
    
    // Document ready...
    $(function() {
        init();
    });
})(jQuery);