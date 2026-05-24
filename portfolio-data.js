/* ═══════════════════════════════════════════════════════════
   portfolio-data.js — Forever Home Interiors
   Image paths and flipbook page definitions.

   fit options (per image in the `fits` array):
     'contain' — full image visible, letterboxed with subtle bg (DEFAULT)
                 ✓ floor plans, technical drawings, section elevations
     'cover'   — fills the slot, crops edges to fill
                 ✓ interior perspective renders, photos
   ═══════════════════════════════════════════════════════════ */

/* jshint esversion: 11 */
'use strict';

const IMGS = {
  /* ── Year 1: Top View ── */
  topview:     'images/2d Top view P1.png',

  /* ── Year 1: 5 BHK House — Main Floor ── */
  bhkLiving:   'images/view 1(living Room)P2.jpeg',
  bhkKitchen:  'images/VIEW3(KITCHEN)P2.jpeg',
  bhkPowder:   'images/VIEW7 (POWDER ROOM)P2.jpeg',

  /* ── Year 1: 5 BHK House — Guest Floor ── */
  bhkGuest1:   'images/view 5 (guest room1)P2.jpeg',
  bhkBath1:    'images/VIEW 2(GUEST BATH1)P2.jpeg',
  bhkGuest2:   'images/VIEW4 (GUEST ROOM 2)P2.jpeg',
  bhkBath2:    'images/view 6(GUEST BATH2)P2.jpeg',

  /* ── Year 1: 5 BHK House — Kids Suite ── */
  kidsBed:     'images/VIEW 11 (KIDS ROOM)P2.jpeg',
  kidsBath:    'images/VIEW 13 (KIDS BATH)P2.jpeg',

  /* ── Internship: Ginkgo Restaurant ── */
  ginkgoExt1:  'images/View 1 P3.jpg',
  ginkgoExt2:  'images/View 2 P3.jpg',
  ginkgoInt1:  'images/View 3 P3.jpg',
  ginkgoInt2:  'images/View 4 P3.jpg',
  ginkgoInt3:  'images/View 5 P3.jpg',
  ginkgoInt4:  'images/View 6 P3.jpg',
  ginkgoSec1:  'images/View 7 P3.jpg',
  ginkgoSec2:  'images/View 8 P3.jpg',
  ginkgoSec3:  'images/View 9 P3.jpg',

  /* ── Year 2: Gangulia Residence ── */
  ganguliaTop: 'images/VIEW1 P4.jpeg',
  ganguliaThm: 'images/VIEW5 P4.jpeg',
  ganguliaOfc: 'images/VIEW2 P4.jpeg',
  ganguliaSlp: 'images/VIEW4 P4.jpeg',

  /* ── Internship: Furniture Design ── */
  furnitureA:  'images/table design3 P5.jpg',
  furnitureB:  'images/table view2 P5.jpg',
  furnitureC:  'images/TABLE DESIGN1 P5.jpg',
};

const PAGES = [
  /* 1 — Top View Rendering */
  {
    bg: '#ede9e2', accent: '#6a5040',
    title: 'Top View Rendering',
    tag: 'Year 1 Project',
    desc: 'A rendered residential floor plan exploring spatial organisation, furniture placement, and material differentiation across living areas, bedrooms, kitchen, and outdoor spaces.',
    layout: 'hero',
    imgs: ['topview'],
    fits: ['contain'],
  },

  /* 2 — 5 BHK House: Main Floor */
  {
    bg: '#e9e4dc', accent: '#5e4535',
    title: '5 BHK House — Main Floor',
    tag: 'Year 1 Project',
    desc: 'A two-floor 5BHK house exploring spatial planning, scale, and functionality — featuring kitchen, living room, and powder washroom rendered with full material and furniture detail.',
    layout: 'split1+2',
    imgs: ['bhkLiving', 'bhkKitchen', 'bhkPowder'],
    fits: ['cover', 'cover', 'cover'],
    labels: ['Living Room', 'Kitchen', 'Powder Washroom'],
  },

  /* 3 — 5 BHK House: Guest Floor */
  {
    bg: '#e6e0d8', accent: '#5a4030',
    title: '5 BHK House — Guest Floor',
    tag: 'Year 1 Project',
    desc: 'Four rooms across the guest level — two guest bedrooms and two bathrooms, each with a distinct material palette and mood.',
    layout: 'grid4',
    imgs: ['bhkGuest1', 'bhkBath1', 'bhkGuest2', 'bhkBath2'],
    fits: ['cover', 'cover', 'cover', 'cover'],
    labels: ['Guest Room 1', 'Guest Bath 1', 'Guest Room 2', 'Guest Bath 2'],
  },

  /* 4 — 5 BHK House: Kids Suite */
  {
    bg: '#e8e2da', accent: '#5a4535',
    title: '5 BHK House — Kids Suite',
    tag: 'Year 1 Project',
    desc: 'Elevation renders of the kids suite — bedroom and bathroom with playful material choices and thoughtful spatial planning.',
    layout: 'stack2',
    imgs: ['kidsBed', 'kidsBath'],
    fits: ['cover', 'cover'],
    labels: ['Kids Bedroom', 'Kids Bath'],
  },

  /* 5 — Ginkgo: Exterior */
  {
    bg: '#e5dfd7', accent: '#5a4030',
    title: 'Ginkgo — Japanese Restaurant',
    tag: 'Internship Project',
    desc: 'Renovation of a Japanese restaurant incorporating traditional architectural elements — dark timber screens, open planting, and warm materiality — to create an authentic dining atmosphere.',
    layout: 'stack2',
    imgs: ['ginkgoExt1', 'ginkgoExt2'],
    fits: ['cover', 'cover'],
  },

  /* 6 — Ginkgo: Interiors */
  {
    bg: '#e3ddd5', accent: '#503a28',
    title: 'Ginkgo — Interior & Section Views',
    tag: 'Internship Project',
    desc: 'Four interior perspective drawings and section elevations exploring the spatial sequence, bar counter, dining zones, and layered transparency of the restaurant.',
    layout: 'grid4',
    imgs: ['ginkgoInt1', 'ginkgoInt2', 'ginkgoInt3', 'ginkgoInt4'],
    fits: ['contain', 'contain', 'contain', 'contain'],
    labels: ['Dining View', 'Bar Entry', 'Elevation A', 'Elevation B'],
  },

  /* 7 — Ginkgo: Sections */
  {
    bg: '#e2dcd4', accent: '#4e3826',
    title: 'Ginkgo — Sections',
    tag: 'Internship Project',
    desc: 'Technical section drawings revealing the full spatial depth of the restaurant — counter seating, shelving, outdoor terrace relationship, and interior volume.',
    layout: 'grid3',
    imgs: ['ginkgoSec1', 'ginkgoSec2', 'ginkgoSec3'],
    fits: ['contain', 'contain', 'contain'],
    labels: ['Section A', 'Section B', 'Section C'],
  },

  /* 8 — Gangulia Residence */
  {
    bg: '#eae4dc', accent: '#604838',
    title: 'Gangulia Residence',
    tag: 'Year 2 Project',
    desc: 'A lighting study exploring ambient, task, and accent lighting across a home theatre, home office, and bedroom — demonstrating how thoughtful placement shapes mood and practicality.',
    layout: 'grid3+1',
    imgs: ['ganguliaThm', 'ganguliaOfc', 'ganguliaSlp', 'ganguliaTop'],
    fits: ['cover', 'cover', 'cover', 'contain'],
  },

  /* 9 — Furniture Design */
  {
    bg: '#e7e1d9', accent: '#584030',
    title: 'Furniture Design',
    tag: 'Internship Project',
    desc: 'Custom table concepts developed during internship — exploring joinery details, structural connections, and the contrast of two wood types to highlight craftsmanship.',
    layout: 'trio',
    imgs: ['furnitureA', 'furnitureB', 'furnitureC'],
    fits: ['contain', 'contain', 'contain'],
  },
];
