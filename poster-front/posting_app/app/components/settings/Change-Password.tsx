" use client";

export const ChangePassword = () => {
return (

     <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Change Your password</legend>
        <label className="label"> Current Password</label>
        <input
          name="password"
          type="password"
          className="input"
          placeholder="Enter Your Current Password"
          required
        />

        <label className="label"> New Password</label>
        <input
          name="newpassword"
          type="password"
          className="input"
          placeholder="Enter Your New Password"
          required
        />

        <label className="label">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          className="input"
          placeholder="Confirm Your Password"
        />

        </fieldset>

)
}