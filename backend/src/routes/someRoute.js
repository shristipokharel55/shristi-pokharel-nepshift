router.get(
  "/worker-dashboard",
  protect,
  authorizeRoles("worker"),
  (req, res) => {
    res.json({ message: "Worker dashboard data" });
  }
);

router.get(
  "/employer-dashboard",
  protect,
  authorizeRoles("employer"),
  (req, res) => {
    res.json({ message: "Employer dashboard data" });
  }
);

router.get(
  "/admin-dashboard",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
