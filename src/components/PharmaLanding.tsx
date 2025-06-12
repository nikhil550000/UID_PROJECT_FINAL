import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Pill, 
  Building2, 
  Package, 
  Calendar,
  DollarSign,
  MapPin,
  Truck,
  Database,
  BarChart3,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Factory,
  Store,
  FileText,
  TrendingUp,
  AlertTriangle,
  Zap,
  Globe,
  Award,
  Microscope,
  HeartHandshake,
  Eye,
  Star,
  Play,
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';

interface PharmaLandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const PharmaLanding: React.FC<PharmaLandingProps> = ({ onGetStarted, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    {
      icon: Pill,
      title: "Medicine Manufacturing",
      description: "Track medicine details, manufacturing dates, expiry dates, and pricing with precision",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Building2,
      title: "Medical Store Network",
      description: "Manage comprehensive store database with IDs, names, and location details",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Package,
      title: "Supply Chain Management",
      description: "Monitor medicine distribution with quantities, dates, and relationship tracking",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Generate insights from manufacturing to distribution with detailed reports",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { label: "Medicines Tracked", value: "10,000+", icon: Pill },
    { label: "Medical Stores", value: "500+", icon: Building2 },
    { label: "Daily Transactions", value: "2,500+", icon: Package },
    { label: "Data Accuracy", value: "99.9%", icon: CheckCircle }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Pharmacist, MediCorp",
      content: "This system revolutionized how we track our medicine inventory and distribution. The real-time monitoring has reduced our expiry losses by 60%.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Supply Chain Manager, PharmaPlus",
      content: "The comprehensive database management and analytics have streamlined our operations significantly. We can now track every medicine from manufacturing to store delivery.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Operations Director, HealthTech",
      content: "Outstanding platform for pharmaceutical management. The user interface is intuitive and the reporting capabilities are exactly what we needed.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PharmaTrack Pro
                </h1>
                <p className="text-xs text-gray-600">Pharmaceutical Database Solutions</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#solutions" className="text-gray-700 hover:text-blue-600 transition-colors">Solutions</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <Button variant="ghost" onClick={onLogin} className="text-blue-600">
                Sign In
              </Button>
              <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700">Features</a>
                <a href="#solutions" className="text-gray-700">Solutions</a>
                <a href="#testimonials" className="text-gray-700">Testimonials</a>
                <a href="#contact" className="text-gray-700">Contact</a>
                <Button variant="ghost" onClick={onLogin} className="text-blue-600 justify-start">
                  Sign In
                </Button>
                <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-100"
          >
            <source src="/landing_page.mov" type="video/mp4" />
            {/* Fallback for browsers that don't support MOV */}
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/60 to-purple-50/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                <Award className="h-4 w-4 mr-2" />
                Industry-Leading Pharmaceutical Management Platform
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Complete Medicine
                </span>
                <br />
                <span className="text-gray-900">
                  Manufacturing & Distribution Management
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                Streamline your pharmaceutical operations from medicine manufacturing to store distribution. 
                Monitor medicine details, manage medical store partnerships, and track supply chains with our 
                comprehensive database system trusted by industry leaders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="text-lg px-8 py-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full">
                    <DialogHeader>
                      <DialogTitle>PharmaTrack Pro Demo</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-video">
                      <video
                        controls
                        className="w-full h-full rounded-lg"
                        poster="/placeholder.svg"
                      >
                        <source src="/watch-demo.mov" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    const isActive = index === activeFeature;
                    return (
                      <Card 
                        key={index} 
                        className={`transition-all duration-500 transform ${
                          isActive ? 'scale-105 shadow-xl bg-white' : 'scale-100 bg-white/90'
                        }`}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 mb-6">
              <Database className="h-4 w-4 mr-2" />
              Database Solution
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Solving Complex Pharmaceutical Challenges
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive system addresses the intricate needs of pharmaceutical companies managing 
              medicine manufacturing, distribution networks, and medical store partnerships efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Pill className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-blue-900 text-xl">Medicine Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Complete medicine database with names and company details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Precise tracking of manufacturing and expiry dates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Dynamic pricing management and inventory control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Automated expiry alerts and notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-green-900 text-xl">Medical Store Network</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive store database with unique identifiers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Detailed store names and location mapping</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Partnership relationship management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Geographic distribution analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-purple-900 text-xl">Supply Chain Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-purple-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time medicine-to-store distribution tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Precise quantity monitoring and supply scheduling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Advanced many-to-many relationship management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Supply chain optimization and analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Database Schema Showcase */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
            <CardHeader className="text-center pb-8">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold mb-4">Robust Database Architecture</CardTitle>
              <CardDescription className="text-xl text-gray-300">
                Enterprise-grade database design optimized for pharmaceutical operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Pill className="h-12 w-12 text-white mx-auto" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Medicines Table</h4>
                  <div className="text-gray-300 space-y-2">
                    <p>• Medicine Name & Company</p>
                    <p>• Manufacturing Date</p>
                    <p>• Expiry Date</p>
                    <p>• Price Management</p>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Building2 className="h-12 w-12 text-white mx-auto" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Medical Stores Table</h4>
                  <div className="text-gray-300 space-y-2">
                    <p>• Unique Store ID</p>
                    <p>• Store Name</p>
                    <p>• Location Details</p>
                    <p>• Contact Information</p>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Package className="h-12 w-12 text-white mx-auto" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">Supply Records Table</h4>
                  <div className="text-gray-300 space-y-2">
                    <p>• Medicine-Store Relations</p>
                    <p>• Supply Quantities</p>
                    <p>• Supply Dates</p>
                    <p>• Transaction History</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-6">
              <Star className="h-4 w-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Complete Pharmaceutical Management Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your pharmaceutical operations efficiently with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Medicine Registry",
                description: "Comprehensive database of all manufactured medicines with detailed tracking of manufacturing dates, expiry dates, and pricing information with automated alerts.",
                color: "blue"
              },
              {
                icon: MapPin,
                title: "Store Management",
                description: "Complete medical store directory with store IDs, names, and location details for efficient distribution network management and partnership tracking.",
                color: "green"
              },
              {
                icon: Truck,
                title: "Supply Tracking",
                description: "Track all medicine distributions to stores including quantities, dates, and maintain many-to-many relationships with real-time updates.",
                color: "purple"
              },
              {
                icon: BarChart3,
                title: "Analytics & Reports",
                description: "Generate detailed reports on medicine distribution, store performance, and supply chain analytics for better decision making and forecasting.",
                color: "orange"
              },
              {
                icon: AlertTriangle,
                title: "Smart Alerts",
                description: "Automated alerts for medicines nearing expiry dates, low stock levels, and supply disruptions to prevent operational issues.",
                color: "red"
              },
              {
                icon: ShieldCheck,
                title: "Data Security",
                description: "Enterprise-grade security with role-based access control, audit trails, and compliance management for regulatory requirements.",
                color: "indigo"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className={`h-14 w-14 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-6">
              <HeartHandshake className="h-4 w-4 mr-2" />
              Client Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See how pharmaceutical companies are transforming their operations with our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Pharmaceutical Operations?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join leading pharmaceutical companies using our comprehensive platform to efficiently manage 
            their medicine manufacturing, distribution, and store partnerships. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-12 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Factory className="mr-2 h-6 w-6" />
              Start Free Trial
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-12 py-4 transition-all duration-300"
            >
              <Users className="mr-2 h-6 w-6" />
              Employee Access
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Pill className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PharmaTrack Pro</h3>
                  <p className="text-gray-400">Pharmaceutical Database Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Leading the pharmaceutical industry with innovative database management solutions. 
                Streamlining operations from manufacturing to distribution.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Medicine Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Store Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Supply Chain</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@pharmatrack.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>New York, NY 10001</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 PharmaTrack Pro. All rights reserved. Efficient pharmaceutical data management.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PharmaLanding;
