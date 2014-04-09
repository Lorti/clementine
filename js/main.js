/**
 * MAIN.js
 * @author office@manuelwieser.com
 */

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

var allTimeRequest = new XMLHttpRequest(),
    weeklyRequest = new XMLHttpRequest(),
    dailyRequest = new XMLHttpRequest();

allTimeRequest.onreadystatechange = function() {
  if (allTimeRequest.readyState === 4) {
    if (allTimeRequest.status === 200) {
      try {
        var response = JSON.parse(allTimeRequest.responseText);
        createTables(response, 'allTimeTable');
      } catch (exception) {
        console.error('There is a problem with the response from the server.');
      }
    } else {
      console.error('There was a problem with the request.');
    }
  }
};

weeklyRequest.onreadystatechange = function() {
  if (weeklyRequest.readyState === 4) {
    if (weeklyRequest.status === 200) {
      try {
        var response = JSON.parse(weeklyRequest.responseText);
        createTables(response, 'weeklyTable');
      } catch (exception) {
        var element = document.getElementById('weeklyTable');
        element.textContent = 'Nobody has played since Sunday. Play now, be the first and challenge your friends!';
        element.className += ' s-loaded';
      }
    } else {
      console.error('There was a problem with the request.');
    }
  }
};

dailyRequest.onreadystatechange = function() {
  if (dailyRequest.readyState === 4) {
    if (dailyRequest.status === 200) {
      try {
        var response = JSON.parse(dailyRequest.responseText);
        createTables(response, 'dailyTable');
      } catch (exception) {
        var element = document.getElementById('dailyTable');
        element.textContent = 'Nobody has played today. Play now, get a trophy and challenge your friends!';
        element.className += ' s-loaded';
      }
    } else {
      console.error('There was a problem with the request.');
    }
  }
};

var now = new Date(),
    lastSunday = new Date(now.getTime() - 60 * 60 * 24 * now.getDay() * 1000);

var weeklyTimestamp = lastSunday.getFullYear().toString().slice(-2) +
                      pad(lastSunday.getMonth() + 1, 2) +
                      pad(lastSunday.getDate(), 2);

var dailyTimestamp = now.getFullYear().toString().slice(-2) +
                     pad(now.getMonth() + 1, 2) +
                     pad(now.getDate(), 2);

allTimeRequest.open('GET', 'http://www.radiatedpixel.com/highscoresaver/gethighscores.php?table=clementine&limit=3&time=101010', true);
allTimeRequest.send();

weeklyRequest.open('GET', 'http://www.radiatedpixel.com/highscoresaver/gethighscores.php?table=clementine&limit=10&time=' + weeklyTimestamp, true);
weeklyRequest.send();

dailyRequest.open('GET', 'http://www.radiatedpixel.com/highscoresaver/gethighscores.php?table=clementinedaily&limit=10&time=' + dailyTimestamp, true);
dailyRequest.send();

function createTables(data, target) {
  var result = [];
  for (var key in data) {
    var obj = data[key];
    result.push('<!-- {0} --><tr class="{1}"><td>{2}.</td><td><span>{3}</span></td><td>{4}</td></tr>'
        .format(pad(obj.rank, 3),
                getTrophy(obj.percentage),
                obj.rank,
                getName(obj.name),
                obj.score));
  }
  var html = '<table><tbody>' + result.sort().join('') + '</tbody></table>';
  document.getElementById(target).innerHTML = html;
  document.getElementById(target).className += ' s-loaded';
}

function getTrophy(percentage) {
  if (percentage >= 0.95) {
    return 'gold';
  } else if (percentage >= 0.70) {
    return 'silver';
  } else if (percentage >= 0.30) {
    return 'bronze';
  } else {
    return 'none';
  }
}

function getName(string) {
  return string.split('|')[1];
}

function pad(string, length) {
  return (Array(length).join('0') + string).slice(-length);
}
