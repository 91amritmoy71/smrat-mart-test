import React from 'react';

const Contact = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">Contact Us</h2>

      <div className="row g-5">
        {/* Contact Form */}
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" className="form-control" id="subject" placeholder="Subject" />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea className="form-control" id="message" rows="4" placeholder="Write your message here..." required></textarea>
              </div>

              <button type="submit" className="btn btn-danger w-100">Send Message</button>
            </form>
          </div>
        </div>

        {/* Map or Info */}
        <div className="col-md-6">
          <div className="card shadow">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14605.543345189744!2d88.12870925!3d23.27074585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f9bcdb4fcda0e5%3A0x7a69bfb735234b68!2sBaidyapur%2C%20West%20Bengal%20713213!5e0!3m2!1sen!2sin!4v1627644742204!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px", borderRadius: "6px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;