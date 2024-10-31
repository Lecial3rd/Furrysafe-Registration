import {
    createBuddyReport
}
    from "../model/buddyModel.js"

export const insertBuddyReport = (req, res) => {
    createBuddyReport(req, res);
};
