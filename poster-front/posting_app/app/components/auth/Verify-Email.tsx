export const VerifyEmail = () => {
return (
<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Type your email for password reset</legend>
  <label className="label">Email</label>
  <input type="email" className="input" placeholder="Email" />
  </fieldset>
)
}