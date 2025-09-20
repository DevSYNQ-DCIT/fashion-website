import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart, LayoutDashboard, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const { itemCount } = useCart();

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-effect transition-luxury">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-fashion-gradient rounded-lg"></div>
                        <span className="text-2xl font-serif font-bold text-gradient">
              Threadz BiGaskins
            </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-foreground hover:text-accent transition-luxury font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* CTA Button & User Actions */}
                    <div className="hidden md:flex items-center space-x-2">
                        <ThemeToggle />
                        <Link to="/cart" className="relative">
                            <Button variant="ghost" size="sm">
                                <ShoppingCart className="w-4 h-4" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                                )}
                            </Button>
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-2">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="hidden md:block">
                                        <Button variant="ghost" size="sm" className="text-accent">
                                            <LayoutDashboard className="w-4 h-4 mr-1" />
                                            Admin
                                        </Button>
                                    </Link>
                                )}
                                <Link to="/dashboard" className="flex items-center space-x-2">
                                    <UserAvatar 
                                        name={user.name} 
                                        gender="other" 
                                        className="h-8 w-8"
                                    />
                                    <span>{user.name.split(' ')[0]}</span>
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="elegant" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-border">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-foreground hover:text-accent transition-luxury font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="flex flex-col space-y-3">
                                <div className="px-2 py-1">
                                    <ThemeToggle />
                                </div>
                                <Link to="/cart" className="relative">
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Cart ({itemCount})
                                    </Button>
                                </Link>
                                {user ? (
                                    <>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setIsOpen(false)}>
                                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                                    Admin Dashboard
                                                </Button>
                                            </Link>
                                        )}
                                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                                <User className="w-4 h-4 mr-2" />
                                                My Account
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/login">
                                        <Button variant="elegant" size="sm" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;