import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { mount } from 'react-mounter';
import { Session } from 'meteor/session';

import MainLayout from '../ui/layouts/MainLayout.jsx';

import Dashboard from '../ui/components/Dashboard.jsx';

FlowRouter.route('/', {
  name: "home",
  action() {
    mount(Dashboard)
  }
})
