import { Meteor } from 'meteor/meteor';
import { Images } from '/imports/api/images';

Meteor.startup(() => {
  // code to run on server at startup
  Images.remove();
});
