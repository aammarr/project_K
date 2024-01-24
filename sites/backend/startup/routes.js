import express from 'express';
import user from '../routes/user.js';
import admin from '../routes/admin.js';
import category from '../routes/category.js';
import template from '../routes/template.js';
import dashboard from '../routes/dashboard.js';
import defaultRoute from '../routes/default.js';

export default function(app) {
  app.use(express.json());
  app.use('/', defaultRoute);
  app.use('/api', defaultRoute);
  app.use('/api/admin', admin);
  app.use('/api/user', user);
  app.use('/api/category', category);
  app.use('/api/template', template);
  app.use('/api/dashboard', dashboard);
}