import { useState } from 'react'

const inputClass =
  'w-full rounded-lg border border-tile-border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-wii-blue-600'
const labelClass = 'mb-1 block text-sm font-semibold text-wii-blue-800'

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="rounded-xl border border-tile-border bg-white p-6 text-center shadow-sm">
        <p className="font-heading text-lg font-bold text-wii-blue-800">
          Thanks for your interest!
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Applications aren't open yet — this form is a placeholder while we finalize the
          real application (a Google Form or in-house portal will replace it here).
          Follow our socials to know the moment it opens.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
      className="space-y-4 rounded-xl border border-tile-border bg-white p-6 shadow-sm"
    >
      <p className="text-sm text-slate-500">
        This application form is a placeholder — it isn't wired to a backend yet. It'll be
        replaced with a real application (or an embedded Google Form) closer to the event.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Full name
          </label>
          <input className={inputClass} id="name" name="name" type="text" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input className={inputClass} id="email" name="email" type="email" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="school">
            School
          </label>
          <input className={inputClass} id="school" name="school" type="text" />
        </div>
        <div>
          <label className={labelClass} htmlFor="major">
            Major
          </label>
          <input className={inputClass} id="major" name="major" type="text" />
        </div>
        <div>
          <label className={labelClass} htmlFor="experience">
            Experience level
          </label>
          <select className={inputClass} id="experience" name="experience">
            <option>First hackathon</option>
            <option>Some experience</option>
            <option>Very experienced</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="shirtSize">
            T-shirt size
          </label>
          <select className={inputClass} id="shirtSize" name="shirtSize">
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="why">
          Why do you want to join?
        </label>
        <textarea className={inputClass} id="why" name="why" rows={4} />
      </div>

      <div>
        <label className={labelClass} htmlFor="dietary">
          Dietary restrictions
        </label>
        <input className={inputClass} id="dietary" name="dietary" type="text" />
      </div>

      <button
        type="submit"
        className="font-heading w-full rounded-lg bg-wii-blue-600 py-2.5 font-bold text-white shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        Submit application
      </button>
    </form>
  )
}
