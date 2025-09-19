import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Import SVG files
import FacebookIcon from '@/assets/facebook.svg';
import InstagramIcon from '@/assets/instagram.svg';
import TiktokIcon from '@/assets/tiktok.svg';
import WhatsappIcon from '@/assets/whatsapp.svg';

const Footer = () => {
    const { toast } = useToast();
    const [isConsultationOpen, setIsConsultationOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        
        // Show success toast
        toast({
            title: "Consultation Requested!",
            description: "We've received your request and will contact you shortly.",
            duration: 5000,
        });
        
        // Close the modal after submission
        setIsConsultationOpen(false);
        
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            service: '',
            message: ''
        });
    };

    const socialLinks = [
        { 
            icon: <img src={InstagramIcon} alt="Instagram" className="w-5 h-5" />, 
            href: "https://www.instagram.com/threadz_bigaskins", 
            label: "Instagram" 
        },
        { 
            icon: <img src={TiktokIcon} alt="TikTok" className="w-5 h-5" />, 
            href: "https://www.tiktok.com/@threadz_bigaskins", 
            label: "TikTok" 
        },
        { 
            icon: <img src={FacebookIcon} alt="Facebook" className="w-5 h-5" />, 
            href: "#", 
            label: "Facebook" 
        },
        { 
            icon: <img src={WhatsappIcon} alt="WhatsApp" className="w-5 h-5" />, 
            href: "https://wa.me/qr/Y7FNSXBVUYIGC1", 
            label: "WhatsApp" 
        },
    ];

    const quickLinks = [
        { name: "About Us", href: "#about" },
        { name: "Services", href: "#services" },
        { name: "Portfolio", href: "#portfolio" },
        { name: "Contact", href: "#contact" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
    ];

    const services = [
        { name: "Custom Couture", href: "#" },
        { name: "Design Consultation", href: "#" },
        { name: "Alterations", href: "#" },
        { name: "Bridal Couture", href: "#" },
        { name: "Express Service", href: "#" },
        { name: "Seasonal Collections", href: "#" },
    ];

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-6">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-secondary rounded-lg"></div>
                            <span className="text-2xl font-serif font-bold">
                Threadz BiGaskins
              </span>
                        </div>
                        <p className="text-primary-foreground/80 leading-relaxed">
                            Creating bespoke fashion pieces that define luxury and elegance.
                            Where craftsmanship meets artistry.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-luxury"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-serif font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-primary-foreground/80 hover:text-secondary transition-luxury"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-serif font-semibold mb-6">Services</h3>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href={service.href}
                                        className="text-primary-foreground/80 hover:text-secondary transition-luxury"
                                    >
                                        {service.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div id="contact">
                        <h3 className="text-lg font-serif font-semibold mb-6">Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 mt-1 text-secondary flex-shrink-0" />
                                <div className="text-primary-foreground/80">
                                    <div>Adenta Housing Christ Apostolic Church</div>
                                    <div>Accra</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                                <span className="text-primary-foreground/80">(+223) 0248167891/0544701851</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                                <span className="text-primary-foreground/80">threadzbigaskins@gmail.com</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setIsConsultationOpen(true)}
                            >
                                Book Consultation
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="py-8 border-t border-primary-foreground/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xl font-serif font-semibold mb-2">Stay Updated</h3>
                            <p className="text-primary-foreground/80">
                                Get the latest fashion insights and exclusive offers.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            />
                            <Button variant="secondary">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-primary-foreground/80 text-sm">
                        2025 Threadz BiGaskins. All rights reserved.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                        <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-luxury">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-luxury">
                            Terms of Service
                        </a>
                        <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-luxury">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>

            {/* Consultation Form Modal */}
            <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif">Book a Consultation</DialogTitle>
                        <button 
                            onClick={() => setIsConsultationOpen(false)}
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                                    Service of Interest
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white"
                                >
                                    <option value="">Select a service</option>
                                    {services.map((service, index) => (
                                        <option key={index} value={service.name}>{service.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tell us about your project *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-2">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setIsConsultationOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="default"
                                className="bg-secondary hover:bg-secondary/90"
                            >
                                Request Consultation
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </footer>
    );
};

export default Footer;