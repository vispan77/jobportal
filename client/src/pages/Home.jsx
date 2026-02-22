import React from "react";
import { Star, Users, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* main part */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
              <Star className="h-4 w-4" />
              Trusted by 50,000+ professionals
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Where Great Work <span className="text-blue-600">Meets</span> Great Talent
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              GigFlow connects businesses with skilled freelancers. Post your project, receive competitive bids, and hire the perfect match for your needs.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/gigs"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:bg-blue-700 transition"
              >
                Saerch Jobs <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/create-gig"
                className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-2xl hover:bg-blue-50 transition"
              >
                Post Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* feature */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose GigFlow?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10 mx-auto text-blue-600 mb-4" />,
                title: "Talented Professionals",
                desc: "Access a pool of skilled freelancers ready to deliver high-quality work on time."
              },
              {
                icon: <Clock className="h-10 w-10 mx-auto text-blue-600 mb-4" />,
                title: "Fast Hiring",
                desc: "Post your project and receive competitive bids within hours, not days."
              },
              {
                icon: <DollarSign className="h-10 w-10 mx-auto text-blue-600 mb-4" />,
                title: "Cost Effective",
                desc: "Choose from multiple bids and hire the perfect freelancer for your budget."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* working parts */}
      <section className="py-20 lg:py-32 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "1. Post Your Project",
                desc: "Describe your project, set your budget, and publish it to our network."
              },
              {
                step: "2. Receive Bids",
                desc: "Freelancers submit proposals with timelines and cost estimates."
              },
              {
                step: "3. Hire the Best",
                desc: "Review proposals, chat with freelancers, and hire the one that fits your needs."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">{item.step}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 lg:py-32 bg-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Freelancer?</h2>
          <p className="text-lg text-gray-600 mb-10">
            Join thousands of businesses already using GigFlow to hire top talent.
          </p>
          <Link
            to="/gigs"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-md hover:bg-blue-700 transition"
          >
            Saerch Jobs <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;







