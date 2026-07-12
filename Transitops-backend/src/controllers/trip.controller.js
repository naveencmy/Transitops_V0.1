/**
 * Trip Controller
 * Handles trip lifecycle: create, dispatch, complete, cancel
 */

const tripService = require('../services/trip.service');

class TripController {
  async getAll(req, res, next) {
    try {
      const filters = { 
        status: req.query.status,
        search: req.query.search
      };
      const trips = await tripService.getAllTrips(filters);
      res.json({ success: true, data: trips });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const trip = await tripService.getTripById(req.params.id);
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const trip = await tripService.createTrip(req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const trip = await tripService.updateTrip(req.params.id, req.body);
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async dispatch(req, res, next) {
    try {
      const trip = await tripService.dispatchTrip(req.params.id);
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async complete(req, res, next) {
    try {
      const trip = await tripService.completeTrip(req.params.id, req.body);
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const trip = await tripService.cancelTrip(req.params.id);
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await tripService.deleteTrip(req.params.id);
      res.json({ success: true, message: 'Trip deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TripController();
