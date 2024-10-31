import {
    retrieveReportCategory
}
from '../model/subModel.js'

export const getReportCategory = (req, res) => {
    retrieveReportCategory(req, res);
  };