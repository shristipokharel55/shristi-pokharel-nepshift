import Notification from "../models/Notification.js";

/**
 * Get user notifications
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(20);

    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      read: false 
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
};

/**
 * Mark notification as read
 * @route PUT /api/notifications/:id/read
 * @access Private
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification"
    });
  }
};

/**
 * Mark all notifications as read
 * @route PUT /api/notifications/read-all
 * @access Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications"
    });
  }
};

/**
 * Delete notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    await Notification.findOneAndDelete({ _id: id, recipient: userId });

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification"
    });
  }
};
