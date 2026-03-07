
import React from 'react';

export interface Service {
  icon: string;
  title: string;
  description: string;
  subItems?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface Approach {
  title: string;
  description: string;
  icon: string;
}

export interface Partner {
  name: string;
  icon: string;
}

export interface GalleryImage {
  image: string;
  caption?: string;
  alt: string;
}

export interface Branding {
  logoTop: string;
  logoBottom: string;
  logoTopSize: number;      // Size in pixels (32-250)
  logoBottomSize: number;   // Size in pixels (32-250)
}

export interface About {
  title: string;
  subtitle: string;
  whoWeAre: string;
  mission: string;
  vision: string;
}

export interface Content {
  // Section metadata
  servicesTitle: string;
  servicesSubtitle: string;
  approachTitle: string;
  approachSubtitle: string;
  partnersTitle: string;
  partnersSubtitle: string;
  partnersVisible: boolean;
  teamTitle: string;
  teamSubtitle: string;
  teamVisible: boolean;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryVisible: boolean;

  // Content arrays
  navLinks: { name: string; href: string }[];
  branding: Branding;
  about: About;
  services: Service[];
  team: TeamMember[];
  approach: Approach[];
  partners: Partner[];
  gallery: GalleryImage[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}
