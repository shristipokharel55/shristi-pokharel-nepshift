// src/components/auth/HelperRegisterForm.jsx
import PasswordToggle from "../ui/PasswordToggle";

export default function HelperRegisterForm(){
  return (
    <form className="space-y-4">
      <input name="fullName" placeholder="Full name" />
      <input name="phone" placeholder="Phone" />
      <input name="skill" placeholder="Skills (comma separated)" />
      {/* location field — see map option below */}
      <div>
        <label>Location</label>
        <input name="location_text" placeholder="City, ward or pick on map" />
        {/* optionally show button "Pick on map" */}
      </div>

      <PasswordToggle name="password" placeholder="Password" />
      <PasswordToggle name="confirmPassword" placeholder="Confirm password" />

      <button type="submit" className="...">Create account</button>
    </form>
  );
}
