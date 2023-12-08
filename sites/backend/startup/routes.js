import express from 'express';
import user from '../routes/user.js';
import category from '../routes/category.js';
import defaultRoute from '../routes/default.js';

export default function(app) {
  app.use(express.json());
  app.use('/', defaultRoute);
  app.use('/api', defaultRoute);
  app.use('/api/user', user);
  app.use('/api/category', category);
}