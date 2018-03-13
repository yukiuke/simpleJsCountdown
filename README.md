# simpleJsCountdown
JS logic for accepting HH:MM:SS from the url and counting down to zero from that time. Developed specifically for streaming.

# Usage
http://localhost/countdown.html?t=1h5m20s<br>
Point your browser (or browser plugin) to the HTML demo file and include the **time** string parameter, `t`.

#### Notes:
* Each unit of time is optional.
* Time string must contain units of time in descending order (i.e. HH > MM > SS).
* Script only supports Hours, Minutes and Seconds.
* Script automatically recalculates and formats time values that excede the arbitrary maximum Humans have placed on them.<br>
  Ex: If you passed in `t=61m67s`, the counter will display and begin counting down from `1:02:07`.
* Loosely requires jQuery (included).

It's a little unclean and could be more OOP, but it's quick and easy (^v^)
