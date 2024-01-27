import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PremiumPlans = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Premium Plans</h2>

      <div className="row">
        {/* Silver Plan */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="text-center">Silver Plan</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title text-center">$9.99/month</h1>
              <ul className="list-unstyled">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                {/* Add more features here */}
              </ul>
            </div>
            <div className="card-footer text-center">
              {user ? (
                <button className="btn btn-primary">Subscribe</button>
              ) : (
                <Link to="/sign-up" className="btn btn-success">
                  Sign Up Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Gold Plan */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="text-center">Gold Plan</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title text-center">$49.99/6 months</h1>
              <ul className="list-unstyled">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                {/* Add more features here */}
              </ul>
            </div>
            <div className="card-footer text-center">
              {user ? (
                <button className="btn btn-primary">Subscribe</button>
              ) : (
                <Link to="/sign-up" className="btn btn-success">
                  Sign Up Now
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Diamond Plan */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="text-center">Diamond Plan</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title text-center">$94.99/year</h1>
              <ul className="list-unstyled">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
                {/* Add more features here */}
              </ul>
            </div>
            <div className="card-footer text-center">
              {user ? (
                <button className="btn btn-primary">Subscribe</button>
              ) : (
                <Link to="/sign-up" className="btn btn-success">
                  Sign Up Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlans;
