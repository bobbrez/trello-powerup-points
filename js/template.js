/* global TrelloPowerUp */

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';

var pointScale = {
  nc: { cost: 0,  title: 'Not Sized', color: '' },
  xs: { cost: 1,  title: 'X-Small',   color: 'green' },
  sm: { cost: 2,  title: 'Small',     color: 'green' },
  md: { cost: 4,  title: 'Medium',    color: 'yellow' },
  lg: { cost: 8,  title: 'Large',     color: 'red' },
  xl: { cost: 16, title: 'X-Large',   color: 'red' }
};

var getBadges = function(t){
  return {
    dynamic: function(t, context){
      return t.get('card', 'shared', 'points', 'nc')
      .then(function(d) { 
        console.log("POINTS BADGE", d); 
        
        return {
          title: 'Points', // for detail badges only
          icon: (pointScale[d].color === '' ? GRAY_ICON : WHITE_ICON), // for card front badges only
          text: pointScale[d].title,
          color: pointScale[d].color,
          refresh: 10
        };
      });
    }
  }
};

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Popup List Example',
    items: [
      {
        text: 'Open Overlay',
        callback: function(t){
          return t.overlay({
            url: './overlay.html',
            args: { rand: (Math.random() * 100).toFixed(0) }
          })
          .then(function(){
            return t.closePopup();
          });
        }
      },
      {
        text: 'Open Board Bar',
        callback: function(t){
          return t.boardBar({
            url: './board-bar.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }
    ]
  });
};

var cardButtonCallback = function(t){
  t.get('card').then(function(card){ console.log("CARD", card); });
  
  var items = Object.keys(pointScale).map(function(pointCode){
    return {
      text: pointScale[pointCode].title,
      callback: function(t){
        t.get('card', 'shared', 'points', 'DEFAULT').then(function(d) { console.log("POINTS EXISTING", d); });
        return t.set('card', 'shared', 'points', pointCode)
        .then(function(){
          t.get('card', 'shared', 'points', 'DEFAULT').then(function(d) { console.log("POINTS SET", d); });
          return t.closePopup();
        })
      }
    };
  });

  return t.popup({
    title: 'Points',
    items: items,
    search: {
      count: 5,
      placeholder: 'Search Point Sizes',
      empty: 'No sizes found'
    }
  });
};

TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return [{
      icon: WHITE_ICON,
      text: 'Points',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return getBadges(t);
  },
  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'Points',
      callback: cardButtonCallback
    }];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  },
  'show-settings': function(t, options){
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184
    });
  }
});
