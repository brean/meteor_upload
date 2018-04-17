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
    let images =  Images.find({});
    var imageUrls = Template.instance().imageUrls;
    images.forEach(function (img) {
      Meteor.call('getImageUrl', img._id, function(error, re) {
        console.log(re);
        let imgData = imageUrls.get()
        imgData[img._id] = re;
        imageUrls.set(imgData);
      });
    });
    return images;
  },
  getImageUrl(_id) {
    return Template.instance().imageUrls.get()[_id];
  }
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
