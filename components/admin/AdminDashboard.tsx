import React, { useState, useEffect } from 'react';
import { useContent } from '../../ContentContext';

const ImageUpload: React.FC<{
    label: string;
    currentImage?: string;
    onUpload: (url: string) => void;
    uniqueId?: string;
}> = ({ label, currentImage, onUpload, uniqueId }) => {
    const { uploadImage } = useContent();
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            const url = await uploadImage(file, filename);
            onUpload(url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Check console for details.');
        } finally {
            setUploading(false);
        }
    };

    const inputId = uniqueId || `upload-${label.replace(/\s+/g, '-')}`;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center space-x-4">
                {currentImage && (
                    <div className="relative">
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="h-20 w-20 object-contain border-2 border-green-500 rounded bg-gray-50 p-1"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                    </div>
                )}
                <div className="flex flex-col space-y-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={inputId}
                        disabled={uploading}
                    />
                    <label
                        htmlFor={inputId}
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pdi-red ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? 'Uploading...' : currentImage ? 'Change Image' : 'Choose Image'}
                    </label>
                    {currentImage && (
                        <span className="text-xs text-green-600 font-medium">✓ Image uploaded</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
    const { content, updateContent, saveChanges } = useContent();
    const [activeTab, setActiveTab] = useState('branding');
    const [analytics, setAnalytics] = useState<any>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    // Fetch analytics when analytics tab is opened
    useEffect(() => {
        if (activeTab === 'analytics' && !analytics) {
            fetchAnalytics();
        }
    }, [activeTab]);

    const fetchAnalytics = async () => {
        setLoadingAnalytics(true);
        try {
            const response = await fetch('/api/analytics/stats');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    // Services CRUD
    const handleServicesChange = (index: number, field: string, value: any) => {
        const newServices = [...content.services];
        newServices[index] = { ...newServices[index], [field]: value };
        updateContent({ ...content, services: newServices });
    };

    const addService = () => {
        const newService = {
            icon: 'BookOpenIcon',
            title: 'New Service',
            description: 'Service description here'
        };
        updateContent({ ...content, services: [...content.services, newService] });
    };

    const deleteService = (index: number) => {
        if (confirm('Are you sure you want to delete this service?')) {
            const newServices = content.services.filter((_, i) => i !== index);
            updateContent({ ...content, services: newServices });
        }
    };

    // Team CRUD
    const handleTeamChange = (index: number, field: string, value: string) => {
        const newTeam = [...content.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        updateContent({ ...content, team: newTeam });
    };

    const addTeamMember = () => {
        const newMember = {
            name: 'New Team Member',
            role: 'Role description'
        };
        updateContent({ ...content, team: [...content.team, newMember] });
    };

    const deleteTeamMember = (index: number) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            const newTeam = content.team.filter((_, i) => i !== index);
            updateContent({ ...content, team: newTeam });
        }
    };

    // Approach CRUD
    const handleApproachChange = (index: number, field: string, value: string) => {
        const newApproach = [...content.approach];
        newApproach[index] = { ...newApproach[index], [field]: value };
        updateContent({ ...content, approach: newApproach });
    };

    const addApproach = () => {
        const newItem = {
            icon: 'BeakerIcon',
            title: 'New Approach',
            description: 'Approach description'
        };
        updateContent({ ...content, approach: [...content.approach, newItem] });
    };

    const deleteApproach = (index: number) => {
        if (confirm('Are you sure you want to delete this approach item?')) {
            const newApproach = content.approach.filter((_, i) => i !== index);
            updateContent({ ...content, approach: newApproach });
        }
    };

    // Partners CRUD
    const handlePartnerChange = (index: number, field: string, value: string) => {
        const newPartners = [...content.partners];
        newPartners[index] = { ...newPartners[index], [field]: value };
        updateContent({ ...content, partners: newPartners });
    };

    const addPartner = () => {
        const newPartner = {
            name: 'New Partner',
            icon: 'AcademicCapIcon'
        };
        updateContent({ ...content, partners: [...content.partners, newPartner] });
    };

    const deletePartner = (index: number) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            const newPartners = content.partners.filter((_, i) => i !== index);
            updateContent({ ...content, partners: newPartners });
        }
    };

    // Nav Links CRUD
    const handleNavLinkChange = (index: number, field: string, value: string) => {
        const newNavLinks = [...content.navLinks];
        newNavLinks[index] = { ...newNavLinks[index], [field]: value };
        updateContent({ ...content, navLinks: newNavLinks });
    };

    const addNavLink = () => {
        const newLink = {
            name: 'New Link',
            href: '#new'
        };
        updateContent({ ...content, navLinks: [...content.navLinks, newLink] });
    };

    const deleteNavLink = (index: number) => {
        if (confirm('Are you sure you want to delete this navigation link?')) {
            const newNavLinks = content.navLinks.filter((_, i) => i !== index);
            updateContent({ ...content, navLinks: newNavLinks });
        }
    };

    // Gallery CRUD
    const handleGalleryChange = (index: number, field: string, value: string) => {
        if (!content.gallery) return;
        const newGallery = [...content.gallery];
        newGallery[index] = { ...newGallery[index], [field]: value };
        updateContent({ ...content, gallery: newGallery });
    };

    const addGalleryImage = () => {
        const newImage = {
            image: '/placeholder-gallery.jpg',
            caption: 'New gallery image',
            alt: 'Gallery image description'
        };
        const currentGallery = content.gallery || [];
        updateContent({ ...content, gallery: [...currentGallery, newImage] });
    };

    const deleteGalleryImage = (index: number) => {
        if (!content.gallery) return;
        if (confirm('Are you sure you want to delete this image?')) {
            const newGallery = content.gallery.filter((_, i) => i !== index);
            updateContent({ ...content, gallery: newGallery });
        }
    };

    const handleBrandingChange = (field: string, value: string | number) => {
        updateContent({
            ...content,
            branding: { ...content.branding, [field]: value }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-pdi-dark-blue">BBox Admin</h1>
                <div className="flex gap-3">
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            🚪 Logout
                        </button>
                    )}
                    <button
                        onClick={saveChanges}
                        className="bg-pdi-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-sm"
                    >
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
                {['branding', 'about', 'navigation', 'services', 'team', 'approach', 'partners', 'gallery', 'analytics', 'contact'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold capitalize transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-pdi-red text-pdi-red' : 'border-transparent text-gray-500 hover:text-pdi-red'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {activeTab === 'branding' && (
                    <div className="max-w-2xl space-y-8">
                        <section>
                            <h3 className="text-xl font-bold text-pdi-dark-blue mb-4">Logo Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <ImageUpload
                                        label="Top Navigation Logo"
                                        currentImage={content.branding.logoTop}
                                        onUpload={(url) => handleBrandingChange('logoTop', url)}
                                    />
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Header Logo Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[32, 48, 64, 80, 100, 120, 150].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleBrandingChange('logoTopSize', size)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${content.branding.logoTopSize === size
                                                        ? 'bg-pdi-red text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {size}px
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ImageUpload
                                        label="Footer Logo"
                                        currentImage={content.branding.logoBottom}
                                        onUpload={(url) => handleBrandingChange('logoBottom', url)}
                                    />
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[64, 80, 100, 120, 150, 180, 200, 250].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleBrandingChange('logoBottomSize', size)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${content.branding.logoBottomSize === size
                                                        ? 'bg-pdi-red text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {size}px
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="max-w-4xl space-y-6">
                        <h3 className="text-xl font-bold text-pdi-dark-blue mb-4">About Section Content</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                <input
                                    type="text"
                                    value={content.about.title}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, title: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={content.about.subtitle}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, subtitle: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Who We Are</label>
                                <textarea
                                    rows={5}
                                    value={content.about.whoWeAre}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, whoWeAre: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Our Mission</label>
                                <textarea
                                    rows={3}
                                    value={content.about.mission}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, mission: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Our Vision</label>
                                <textarea
                                    rows={3}
                                    value={content.about.vision}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, vision: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'navigation' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Navigation Links</h3>
                            <button
                                onClick={addNavLink}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Link
                            </button>
                        </div>
                        {content.navLinks.map((link, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteNavLink(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Name</label>
                                        <input
                                            type="text"
                                            value={link.name}
                                            onChange={(e) => handleNavLinkChange(idx, 'name', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Target (href)</label>
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={(e) => handleNavLinkChange(idx, 'href', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-8">
                        {/* Section Metadata */}
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.servicesTitle}
                                        onChange={(e) => updateContent({ ...content, servicesTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <textarea
                                        rows={2}
                                        value={content.servicesSubtitle}
                                        onChange={(e) => updateContent({ ...content, servicesSubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Services</h3>
                            <button
                                onClick={addService}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Service
                            </button>
                        </div>
                        {content.services.map((service, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteService(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={service.title}
                                            onChange={(e) => handleServicesChange(idx, 'title', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <ImageUpload
                                            label="Icon (Image/SVG)"
                                            currentImage={service.icon.startsWith('/') ? service.icon : undefined}
                                            onUpload={(url) => handleServicesChange(idx, 'icon', url)}
                                            uniqueId={`service-icon-${idx}`}
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Or Icon Name</label>
                                            <input
                                                type="text"
                                                value={service.icon}
                                                onChange={(e) => handleServicesChange(idx, 'icon', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                                placeholder="e.g. BookOpenIcon"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            value={service.description}
                                            onChange={(e) => handleServicesChange(idx, 'description', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="space-y-8">
                        {/* Section Metadata */}
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.teamTitle}
                                        onChange={(e) => updateContent({ ...content, teamTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <textarea
                                        rows={2}
                                        value={content.teamSubtitle}
                                        onChange={(e) => updateContent({ ...content, teamSubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="teamVisible"
                                        checked={content.teamVisible}
                                        onChange={(e) => updateContent({ ...content, teamVisible: e.target.checked })}
                                        className="w-5 h-5 text-pdi-red focus:ring-pdi-red border-gray-300 rounded"
                                    />
                                    <label htmlFor="teamVisible" className="text-sm font-medium text-gray-700">
                                        Show this section on homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Team Members</h3>
                            <button
                                onClick={addTeamMember}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Member
                            </button>
                        </div>
                        {content.team.map((member, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteTeamMember(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) => handleTeamChange(idx, 'role', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center border-l border-gray-200 pl-6">
                                        <ImageUpload
                                            label="Team Photo"
                                            currentImage={member.image}
                                            onUpload={(url) => handleTeamChange(idx, 'image', url)}
                                            uniqueId={`team-photo-${idx}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'approach' && (
                    <div className="space-y-8">
                        {/* Section Metadata */}
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.approachTitle}
                                        onChange={(e) => updateContent({ ...content, approachTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <textarea
                                        rows={2}
                                        value={content.approachSubtitle}
                                        onChange={(e) => updateContent({ ...content, approachSubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Our Approach</h3>
                            <button
                                onClick={addApproach}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Item
                            </button>
                        </div>
                        {content.approach.map((item, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteApproach(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => handleApproachChange(idx, 'title', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <ImageUpload
                                            label="Icon (Image/SVG)"
                                            currentImage={item.icon.startsWith('/') ? item.icon : undefined}
                                            onUpload={(url) => handleApproachChange(idx, 'icon', url)}
                                            uniqueId={`approach-icon-${idx}`}
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Or Icon Name</label>
                                            <input
                                                type="text"
                                                value={item.icon}
                                                onChange={(e) => handleApproachChange(idx, 'icon', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                                placeholder="e.g. BeakerIcon"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows={2}
                                            value={item.description}
                                            onChange={(e) => handleApproachChange(idx, 'description', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'partners' && (
                    <div className="space-y-8">
                        {/* Section Metadata */}
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.partnersTitle}
                                        onChange={(e) => updateContent({ ...content, partnersTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <textarea
                                        rows={2}
                                        value={content.partnersSubtitle}
                                        onChange={(e) => updateContent({ ...content, partnersSubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="partnersVisible"
                                        checked={content.partnersVisible}
                                        onChange={(e) => updateContent({ ...content, partnersVisible: e.target.checked })}
                                        className="w-5 h-5 text-pdi-red focus:ring-pdi-red border-gray-300 rounded"
                                    />
                                    <label htmlFor="partnersVisible" className="text-sm font-medium text-gray-700">
                                        Show this section on homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Partners</h3>
                            <button
                                onClick={addPartner}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Partner
                            </button>
                        </div>
                        {content.partners.map((partner, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deletePartner(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                                        <input
                                            type="text"
                                            value={partner.name}
                                            onChange={(e) => handlePartnerChange(idx, 'name', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <ImageUpload
                                            label="Icon (Image/SVG)"
                                            currentImage={partner.icon.startsWith('/') ? partner.icon : undefined}
                                            onUpload={(url) => handlePartnerChange(idx, 'icon', url)}
                                            uniqueId={`partner-icon-${idx}`}
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Or Icon Name</label>
                                            <input
                                                type="text"
                                                value={partner.icon}
                                                onChange={(e) => handlePartnerChange(idx, 'icon', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                                placeholder="e.g. AcademicCapIcon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-8">
                        {/* Section Metadata */}
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.galleryTitle}
                                        onChange={(e) => updateContent({ ...content, galleryTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <textarea
                                        rows={2}
                                        value={content.gallerySubtitle}
                                        onChange={(e) => updateContent({ ...content, gallerySubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="galleryVisible"
                                        checked={content.galleryVisible}
                                        onChange={(e) => updateContent({ ...content, galleryVisible: e.target.checked })}
                                        className="w-5 h-5 text-pdi-red focus:ring-pdi-red border-gray-300 rounded"
                                    />
                                    <label htmlFor="galleryVisible" className="text-sm font-medium text-gray-700">
                                        Show this section on homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Gallery Images</h3>
                            <button
                                onClick={addGalleryImage}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Image
                            </button>
                        </div>
                        {content.gallery && content.gallery.map((item, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteGalleryImage(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div className="space-y-4">
                                        <ImageUpload
                                            label="Gallery Image"
                                            currentImage={item.image}
                                            onUpload={(url) => handleGalleryChange(idx, 'image', url)}
                                            uniqueId={`gallery-image-${idx}`}
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional)</label>
                                            <input
                                                type="text"
                                                value={item.caption || ''}
                                                onChange={(e) => handleGalleryChange(idx, 'caption', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                                placeholder="Brief description of the image"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (Required)</label>
                                            <input
                                                type="text"
                                                value={item.alt}
                                                onChange={(e) => handleGalleryChange(idx, 'alt', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                                                placeholder="Describe the image for accessibility"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-pdi-dark-blue">Visitor Analytics</h3>
                            <button
                                onClick={fetchAnalytics}
                                className="bg-pdi-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {loadingAnalytics ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Loading analytics...</p>
                            </div>
                        ) : analytics ? (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Total Page Views</div>
                                        <div className="text-3xl font-bold">{analytics.totalPageViews.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Unique Visitors (All Time)</div>
                                        <div className="text-3xl font-bold">{analytics.uniqueVisitors.allTime.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Visitors This Month</div>
                                        <div className="text-3xl font-bold">{analytics.uniqueVisitors.month.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Visitors Today</div>
                                        <div className="text-3xl font-bold">{analytics.uniqueVisitors.today.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Top Pages */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Top Pages</h4>
                                    <div className="space-y-2">
                                        {analytics.topPages.map((page: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <span className="text-gray-700 font-mono text-sm">{page.path}</span>
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{page.count} views</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Referrers */}
                                {analytics.topReferrers.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Top Referrers</h4>
                                        <div className="space-y-2">
                                            {analytics.topReferrers.map((ref: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-gray-700 text-sm">{ref.referrer}</span>
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{ref.count} visits</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Visitors */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-lg font-bold text-pdi-dark-blue mb-4">Recent Visitors (Last 500)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Time</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">IP Address</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Page</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Referrer</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.recentVisitors.map((visitor: any, idx: number) => (
                                                    <tr
                                                        key={idx}
                                                        className={`border-b border-gray-100 hover:bg-gray-50 ${visitor.isMalicious || visitor.isBlacklisted ? 'bg-red-50' : ''
                                                            }`}
                                                    >
                                                        <td className="p-3 text-gray-600">{new Date(visitor.timestamp).toLocaleString()}</td>
                                                        <td className="p-3 font-mono text-gray-700 font-semibold">{visitor.ip}</td>
                                                        <td className="p-3 font-mono text-gray-700">{visitor.path}</td>
                                                        <td className="p-3 text-gray-600 truncate max-w-xs">{visitor.referrer}</td>
                                                        <td className="p-3">
                                                            {visitor.isMalicious || visitor.isBlacklisted ? (
                                                                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                                    🚫 THREAT
                                                                </span>
                                                            ) : (
                                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                                    ✓ Safe
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No analytics data available yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={content.contactInfo.email}
                                onChange={(e) => updateContent({ ...content, contactInfo: { ...content.contactInfo, email: e.target.value } })}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={content.contactInfo.phone}
                                onChange={(e) => updateContent({ ...content, contactInfo: { ...content.contactInfo, phone: e.target.value } })}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                            <input
                                type="text"
                                value={content.contactInfo.address}
                                onChange={(e) => updateContent({ ...content, contactInfo: { ...content.contactInfo, address: e.target.value } })}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-pdi-red focus:border-pdi-red transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
