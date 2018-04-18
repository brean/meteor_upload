import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import { Images } from '/imports/api/images';

Meteor.subscribe('files.images.all');

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.showImages.onCreated(function () {
  this.imageUrls = new ReactiveVar({});
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.showImages.helpers({
  imageFiles() {
    return Images.find({});
  },
});

Template.uploadForm.events({
  'change #fileInput'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          // alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});
