-- ============================================================
-- DialMyCoffee - Seed: Grinders (40+ grinders)
-- ============================================================

INSERT INTO grinders (brand, model, adjustment_type, scale_min, scale_max, units, notes) VALUES

-- ============================================================
-- SAGE / BREVILLE BUILT-IN GRINDERS
-- ============================================================
('Sage Built-in', '1-16 Range (Barista Express)', 'stepped', 1, 16, 'steps',
 'Built into Sage Barista Express / Express Impress. Conical burr. Espresso range typically 5-10. Also has internal upper burr ring adjustment for sub-steps. Grind into portafilter only.'),

('Sage Built-in', '1-30 Range (Barista Pro/Touch)', 'stepped', 1, 30, 'steps',
 'Built into Sage Barista Pro, Barista Touch, and Touch Impress. Conical burr. Espresso range typically 8-18. Finer increments than 1-16 models. Grind into portafilter only.'),

('Sage Built-in', '1-45 Range (Oracle)', 'stepped', 1, 45, 'steps',
 'Built into Sage Oracle, Oracle Touch, and Oracle Jet. Conical burr with very fine micro-adjustments. Espresso range typically 15-30. Auto dose and tamp on Oracle models.'),

-- ============================================================
-- SAGE / BREVILLE STANDALONE GRINDERS
-- ============================================================
('Sage', 'Smart Grinder Pro (BCG820)', 'stepped', 1, 60, 'steps',
 'Conical burr, 60 precise settings. LCD with dose timer. Portafilter and container grinding. Espresso range roughly 5-15. Good entry-level electric grinder.'),

('Sage', 'Dose Control Pro (BCG600)', 'stepped', 1, 18, 'steps',
 'Conical burr, 18 stepped settings plus stepless internal adjustment. Dose timer. Espresso focused. Portafilter cradle. Budget-friendly.'),

-- ============================================================
-- EUREKA
-- ============================================================
('Eureka', 'Mignon Notte', 'stepped', 1, 15, 'positions',
 'Flat burrs (50mm). 15 stepped positions. Quiet operation. Espresso focused. Micrometric stepless adjustment within each step. Good entry-level Eureka.'),

('Eureka', 'Mignon Specialita', 'stepless', 0, 15, 'turns',
 'Flat burrs (55mm). Stepless micrometric adjustment. Touchscreen timer. Very quiet. Diamond Inside burrs. Popular espresso grinder. About 15 full turns of range.'),

('Eureka', 'Mignon XL', 'stepless', 0, 15, 'turns',
 'Flat burrs (65mm). Stepless micrometric. Larger burr set for faster grinding and better particle distribution. Blow-up system to reduce retention. Premium single-dose.'),

('Eureka', 'Mignon Silenzio', 'stepless', 0, 15, 'turns',
 'Flat burrs (55mm). Stepless micrometric. Sound-dampening case. Timed dosing. Very quiet operation (<55dB). Espresso-focused.'),

('Eureka', 'Mignon Single Dose', 'stepless', 0, 15, 'turns',
 'Flat burrs (55mm). Stepless micrometric. Blow-up system for low retention (<0.5g). Single dose hopper. Bellows included. Anti-clumping screen.'),

('Eureka', 'Oro Mignon', 'stepless', 0, 15, 'turns',
 'Flat burrs (55mm). Stepless micrometric. Touch display with timed dosing. ACE system. Diamond Inside burrs. Premium finish.'),

-- ============================================================
-- NICHE
-- ============================================================
('Niche', 'Zero', 'stepless', 0, 50, 'marks',
 'Conical burrs (63mm Mazzer Kony-style). Stepless dial 0-50 with fine markings. Zero retention design. Single dose hopper. All-purpose (espresso to filter). Very popular home grinder. Espresso range roughly 8-18.'),

('Niche', 'Duo', 'stepless', 0, 50, 'marks',
 'Flat burrs (83mm). Stepless dial 0-50. Two separate grinding positions for espresso and filter. Zero retention. Single dose. Premium flat burr option from Niche.'),

-- ============================================================
-- BARATZA
-- ============================================================
('Baratza', 'Sette 270Wi', 'stepped', 1, 31, 'macro+micro',
 'Conical burrs. 31 macro steps with stepless micro adjustment (270 total settings). Weighing (Wi) model with built-in scale. Fast grind speed. Espresso range roughly 1-10. Grind by weight.'),

('Baratza', 'Encore ESP', 'stepped', 1, 20, 'steps',
 'Conical burrs (40mm). 20 stepped settings. Espresso-focused version of Encore. Built-in portafilter holder. Timed dosing. Budget-friendly espresso grinder.'),

('Baratza', 'Vario+', 'stepped', 0, 230, 'steps',
 'Flat ceramic burrs (54mm). 230 grind settings (macro 10 x micro 23). Metal portafilter fork. All-purpose. Espresso range roughly 1E-5D. Can switch to steel burrs.'),

-- ============================================================
-- COMANDANTE
-- ============================================================
('Comandante', 'C40 MK4', 'stepped', 0, 40, 'clicks',
 'Hand grinder. High-nitrogen stainless steel burrs (39mm). Stepped clicks with ~30 microns per click. Espresso range roughly 10-18 clicks. Premium build quality. MK4 has Red Clix option for finer steps. Popular travel and home grinder.'),

-- ============================================================
-- 1ZPRESSO
-- ============================================================
('1Zpresso', 'JX-Pro', 'stepped', 0, 200, 'clicks',
 'Hand grinder. 48mm stainless steel burrs. Numbered dial (0-9) with 40 clicks per full rotation. Espresso range roughly 1.0.0 to 2.0.0 (about 60-100 clicks from zero). External adjustment. Very popular value hand grinder.'),

('1Zpresso', 'J-Max', 'stepped', 0, 450, 'clicks',
 'Hand grinder. 48mm stainless steel burrs. Magnetic catch cup. ~90 clicks per number (very fine adjustment - 8.8 microns per click). Espresso-focused with ultra-fine control. External adjustment.'),

('1Zpresso', 'K-Max', 'stepped', 0, 200, 'clicks',
 'Hand grinder. 48mm stainless steel burrs. Multi-purpose (filter-focused but capable for espresso). External adjustment. ~22 microns per click. Anti-slip grip.'),

('1Zpresso', 'K-Plus', 'stepped', 0, 200, 'clicks',
 'Hand grinder. 48mm stainless steel burrs. Multi-purpose. External adjustment. Magnetic catch cup. Blind shaker included. ~22 microns per click. Wooden accent.'),

-- ============================================================
-- TIMEMORE
-- ============================================================
('Timemore', 'Chestnut C3', 'stepped', 0, 36, 'clicks',
 'Hand grinder. Stainless steel burrs (38mm). Budget hand grinder. Stepped clicks. Espresso range roughly 8-14 clicks. Internal adjustment. Good entry-level option.'),

('Timemore', 'Chestnut X', 'stepless', 0, 36, 'numbers',
 'Hand grinder. S2C stainless steel burrs (42mm). Stepless with numbered dial. Foldable handle. Premium build. Espresso and filter capable. External adjustment.'),

-- ============================================================
-- DF64 / TURIN
-- ============================================================
('DF64 (Turin)', 'DF64', 'stepless', 0, 90, 'marks',
 'Single dose flat burr grinder (64mm). Stepless adjustment dial. Standard DLC burrs (can upgrade to SSP, Italmill). Low retention with bellows. Popular mod platform. Espresso range roughly 10-30.'),

('DF64 (Turin)', 'DF64 Gen 2', 'stepless', 0, 90, 'marks',
 'Updated DF64 with improved burr alignment, declumper, and retention. 64mm flat burrs (SSP compatible). Stepless adjustment. Single dose design. Better motor and build quality.'),

-- ============================================================
-- MAZZER
-- ============================================================
('Mazzer', 'Mini Electronic A', 'stepless', 0, 60, 'notches',
 'Commercial flat burrs (64mm). Stepless micrometric adjustment with numbered collar. Doserless (A version). Timer-based dosing. Commercial build quality. Espresso focused.'),

('Mazzer', 'Super Jolly', 'stepless', 0, 60, 'notches',
 'Commercial flat burrs (64mm). Stepless micrometric. Often found as refurbished ex-cafe units. Reliable workhorse. Large burrs for home use. Needs doserless mod for home use.'),

-- ============================================================
-- COMPAK
-- ============================================================
('Compak', 'E5 OD', 'stepless', 0, 40, 'marks',
 'Flat burrs (58mm). On-demand stepless. Micrometric adjustment. Clump crusher. Polycarbonate portafilter fork. Commercial quality for home. Made in Spain.'),

-- ============================================================
-- WEBER WORKSHOPS
-- ============================================================
('Weber Workshops', 'Key', 'stepless', 0, 100, 'marks',
 'Conical burrs (83mm). Stepless with magnetic alignment. Ultra-premium build. Magic Tumbler anti-static system. Near-zero retention. Designed by Douglas Weber. Top-end home grinder.'),

('Weber Workshops', 'EG-1', 'stepless', 0, 100, 'marks',
 'Flat burrs (80mm). Stepless ultra-precise adjustment. Ultra-premium. Speed-controlled DC motor. Near-zero retention. Blind Shaker system. Considered reference-class home grinder.'),

-- ============================================================
-- LAGOM (OPTION-O)
-- ============================================================
('Lagom', 'P64', 'stepless', 0, 90, 'marks',
 'Flat burrs (64mm). Stepless adjustment with numbered ring. Choice of SSP burrs (Cast, HU, MP, Brew). Single dose. Low retention. Magnetic catch cup. Very popular enthusiast grinder.'),

('Lagom', 'P100', 'stepless', 0, 90, 'marks',
 'Flat burrs (98mm). Stepless adjustment. Large commercial-class burrs. Choice of SSP burrs. Extremely fast grind time. Ultra-low retention. Reference flat burr grinder.'),

('Lagom', 'Mini', 'stepped', 0, 36, 'clicks',
 'Hand grinder by Option-O. 47mm Italmill burrs. Stepped clicks. Premium build quality. Internal adjustment via top. Espresso capable. Light weight for travel.'),

-- ============================================================
-- MAHLKONIG
-- ============================================================
('Mahlkonig', 'E65S GbW', 'stepless', 0, 100, 'marks',
 'Commercial flat burrs (65mm). Stepless. Grind-by-Weight technology with integrated scale. Industry standard cafe grinder. Very fast and consistent. Often at barista competitions.'),

('Mahlkonig', 'X54', 'stepped', 1, 16, 'steps',
 'Home grinder with 54mm flat burrs. 16 stepped settings. All-purpose (espresso to filter). Built-in scale option. App connected. Made by Mahlkonig for home market.'),

-- ============================================================
-- FELLOW
-- ============================================================
('Fellow', 'Ode Gen 2', 'stepped', 1, 31, 'settings',
 'Flat burrs (64mm SSP). 31 grind settings. Originally filter-focused, Gen 2 has finer range for espresso. Low retention. Magnetic catch. Stylish design. Single dose.'),

('Fellow', 'Opus', 'stepped', 1, 41, 'settings',
 'Conical burrs (40mm). 41 settings. All-purpose from espresso to cold brew. Load cell stop. Anti-static technology. Budget-friendly from Fellow.'),

-- ============================================================
-- ADDITIONAL POPULAR GRINDERS
-- ============================================================
('Breville', 'Smart Grinder Pro (BCG820)', 'stepped', 1, 60, 'steps',
 'US-market version of Sage Smart Grinder Pro. Conical burr, 60 settings. LCD display. Portafilter and container grinding. Espresso range roughly 5-15.'),

('Baratza', 'Sette 30', 'stepped', 1, 31, 'macro',
 'Conical burrs. 31 macro steps (no micro adjustment). Simpler version of Sette 270. Fast grind speed. Espresso-focused. Budget Baratza option.'),

('Eureka', 'Atom 75', 'stepless', 0, 20, 'turns',
 'Flat burrs (75mm). Stepless micrometric. ACE system. Touchscreen with timed dosing. High speed. Prosumer/commercial. Blow-up system. Quiet.'),

('Ceado', 'E37S', 'stepless', 0, 100, 'marks',
 'Flat burrs (83mm). Stepless micrometric. Quick-Set system for fast grind adjustment. Single dose hopper option. Commercial-grade build. Italian made.'),

('Kafatek', 'Flat Max', 'stepless', 0, 100, 'marks',
 'Ultra-premium flat burr grinder. 98mm SSP burrs. Stepless with digital readout. Extremely low retention. Precision machined. Very limited production.'),

('Levercraft', 'Ultra', 'stepless', 0, 100, 'marks',
 'Premium conical burr grinder. 83mm conical burrs. Stepless with fine-thread adjustment. Near-zero retention. Anti-popcorn design. Very low RPM motor. Hand-built.')

ON CONFLICT DO NOTHING;
