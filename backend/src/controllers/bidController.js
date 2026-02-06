import Bid from "../models/bid.js";
import Shift from "../models/shift.js";
import Notification from "../models/Notification.js";
import User from "../models/user.js"; // Import User for name lookup

/**
 * Place a bid on a shift
 * @route   POST /api/bids
 * @access  Private (Worker only)
 */
export const placeBid = async (req, res) => {
  try {
    const { shiftId, bidAmount, estimatedArrivalTime, message } = req.body;
    const workerId = req.user.id;

    // console.log("Bid placement attempt:", { shiftId, workerId, bidAmount });

    // Make sure all required fields are provided
    if (!shiftId || !bidAmount || !estimatedArrivalTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Find the shift to get the hirer info
    const shift = await Shift.findById(shiftId);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    // Make sure the shift is still open
    if (shift.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This shift is no longer accepting bids"
      });
    }

    // Check if worker already bid on this shift
    const existingBid = await Bid.findOne({ shiftId, workerId: req.user.id });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "You already applied for this shift!"
      });
    }

    // Create the bid
    const bid = await Bid.create({
      shiftId,
      workerId: req.user.id,
      hirerId: shift.hirerId,
      bidAmount,
      estimatedArrivalTime,
      message: message || "",
    });
    await bid.save();

    // Populate the bid with worker and shift details
    await bid.populate("workerId", "fullName email phone");
    await bid.populate("shiftId", "title category date");

    // NOTIFICATION FOR HIRER
    try {
      // Fetch fresh worker details to ensure we have the name
      const worker = await User.findById(workerId);
      const workerName = worker ? worker.fullName : "A worker";

      console.log(`Creating notification for hirer ${shift.hirerId} from worker ${workerName}`);

      await Notification.create({
        recipient: shift.hirerId, // Notify the hirer
        type: "info",
        title: "New Application Received",
        message: `${workerName} has applied for your shift: "${shift.title}".`,
        relatedId: shiftId
      });
    } catch (notifError) {
      console.error("Failed to create notification for hirer:", notifError);
      // Continue execution, don't fail the bid placement
    }

    console.log("Bid placed successfully:", bid._id);

    res.status(201).json({
      success: true,
      message: "Bid placed successfully! The hirer will review it soon.",
      data: bid,
    });
  } catch (error) {
    console.error("Place bid error:", error);

    // Handle duplicate bid error (in case index catches it)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already applied for this shift!"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to place bid"
    });
  }
};

/**
 * Get all bids for a worker
 * @route   GET /api/bids/my-bids
 * @access  Private (Worker only)
 */
export const getMyBids = async (req, res) => {
  try {
    const workerId = req.user.id;

    const bids = await Bid.find({ workerId })
      .populate("shiftId", "title category date time location pay status")
      .populate("hirerId", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    console.error("Get my bids error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your bids"
    });
  }
};

/**
 * Get all bids for a hirer's shifts
 * @route   GET /api/bids/received
 * @access  Private (Hirer only)
 */
export const getReceivedBids = async (req, res) => {
  try {
    const hirerId = req.user.id;

    const bids = await Bid.find({ hirerId })
      .populate("workerId", "fullName email phone")
      .populate("shiftId", "title category date time location pay")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    console.error("Get received bids error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bids"
    });
  }
};

/**
 * Update bid status (accept/reject)
 * @route   PUT /api/bids/:id
 * @access  Private (Hirer only)
 */
export const updateBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hirerId = req.user.id;

    // Find the bid
    const bid = await Bid.findById(id).populate('shiftId');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found"
      });
    }

    // Make sure this hirer owns the shift
    if (bid.hirerId.toString() !== hirerId) {
      return res.status(403).json({
        success: false,
        message: "You can only update bids for your own shifts"
      });
    }

    // Update the status
    bid.status = status;
    await bid.save();

    // NOTIFICATION FOR WORKER
    try {
      const shiftTitle = bid.shiftId ? bid.shiftId.title : 'the shift';
      let notificationTitle = "Application Update";
      let notificationMessage = `Your application for "${shiftTitle}" has been updated.`;
      let notificationType = "info";

      if (status === 'accepted') {
        notificationTitle = "Application Accepted! 🎉";
        notificationMessage = `Congratulations! Your application for "${shiftTitle}" has been accepted. Please check details.`;
        notificationType = "success";
      } else if (status === 'rejected') {
        notificationTitle = "Application Status Update";
        notificationMessage = `Your application for "${shiftTitle}" was not selected at this time.`;
        notificationType = "info"; // Use info instead of error to be less harsh
      }

      await Notification.create({
        recipient: bid.workerId, // Notify the worker
        type: notificationType,
        title: notificationTitle,
        message: notificationMessage,
        relatedId: bid.shiftId._id // Link to the shift
      });

    } catch (notifError) {
      console.error("Failed to create notification for worker:", notifError);
      // Continue execution
    }

    res.status(200).json({
      success: true,
      message: `Bid ${status} successfully`,
      data: bid,
    });
  } catch (error) {
    console.error("Update bid status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update bid"
    });
  }
};
