-- ============================================================
-- DialMyCoffee - Seed: Espresso Machines (80+ machines)
-- ============================================================
-- Note: the 'name' column is auto-generated from brand || ' ' || model.
-- ============================================================

INSERT INTO espresso_machines (
  brand, model, type,
  has_builtin_grinder, supports_temp_control, supports_pressure_control, supports_preinfusion,
  recommended_basket_sizes, default_dose_min, default_dose_max, default_ratio_min, default_ratio_max,
  grind_min, grind_max, espresso_min, espresso_max, notes
) VALUES

-- ============================================================
-- SAGE / BREVILLE (UK-focused naming)
-- ============================================================
(
  'Sage', 'Barista Express (SES875)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 16, 5, 10,
  'Built-in conical burr grinder (1-16 scale). 3 temperature settings. Manual pre-infusion. 54mm portafilter. Internal grind adjustments with upper burr ring for sub-steps.'
),
(
  'Sage', 'Barista Express Impress (SES876)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 16, 5, 10,
  'Same grinder as Barista Express (1-16) with Impress Puck system for assisted tamping. Dose-control grinding. 54mm portafilter. 3 temperature settings.'
),
(
  'Sage', 'Barista Pro (SES878)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 30, 8, 18,
  'Built-in conical burr grinder with 30 steps (finer increments than Express). ThermoJet heating (3 seconds). 5 temperature settings. Digital display. Pre-infusion. 54mm portafilter.'
),
(
  'Sage', 'Barista Touch (SES880)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 30, 8, 18,
  'Touchscreen interface. Built-in grinder 1-30. 5 temperature settings. Automatic milk texturing. Pre-infusion. ThermoJet heating. 54mm portafilter.'
),
(
  'Sage', 'Barista Touch Impress (SES881)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 30, 8, 18,
  'Touchscreen with Impress Puck system. Built-in grinder 1-30. Assisted dosing and tamping. 5 temperature settings. ThermoJet. Pre-infusion. 54mm portafilter.'
),
(
  'Sage', 'Oracle (SES980)', 'semi_auto',
  true, true, true, true,
  ARRAY['58mm single','58mm double'], 19.0, 22.0, 1.5, 2.5,
  1, 45, 15, 30,
  'Dual boiler with built-in conical burr grinder (1-45 scale). Automatic grinding, dosing, tamping. PID temperature control. Adjustable pre-infusion. Over-pressure valve. 58mm portafilter.'
),
(
  'Sage', 'Oracle Touch (SES990)', 'semi_auto',
  true, true, true, true,
  ARRAY['58mm single','58mm double'], 19.0, 22.0, 1.5, 2.5,
  1, 45, 15, 30,
  'Touchscreen Oracle. Dual boiler. Built-in grinder 1-45 with auto dose and tamp. Auto milk texturing. PID temp. Pre-infusion. Pressure control. 58mm portafilter.'
),
(
  'Sage', 'Oracle Jet (SES985)', 'semi_auto',
  true, true, true, true,
  ARRAY['58mm single','58mm double'], 19.0, 22.0, 1.5, 2.5,
  1, 45, 15, 30,
  'Latest Oracle with ThermoJet + dual boiler hybrid. Grinder 1-45 with very precise micro-adjustments. Auto dose, tamp, milk. Advanced extraction profiles. 58mm portafilter.'
),
(
  'Sage', 'Dual Boiler (SES920)', 'semi_auto',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'No built-in grinder - requires separate grinder. True dual boiler. PID temperature control. Adjustable pre-infusion pressure and time. Shot clock. 58mm portafilter. Over-pressure valve.'
),
(
  'Sage', 'Bambino (SES450)', 'semi_auto',
  false, false, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Compact entry-level. No grinder. ThermoJet (3 second heat-up). Pre-infusion. Manual steam wand. 54mm portafilter. Great starter machine.'
),
(
  'Sage', 'Bambino Plus (SES500)', 'semi_auto',
  false, false, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Bambino with automatic milk texturing. ThermoJet. Pre-infusion. Auto purge. 54mm portafilter. No grinder required.'
),
(
  'Sage', 'Infuser (SES875)', 'semi_auto',
  false, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'PID temperature control. No grinder. Variable pre-infusion. Low-pressure pre-infusion then full 9 bar. 54mm portafilter.'
),

-- ============================================================
-- DE''LONGHI
-- ============================================================
(
  'De''Longhi', 'La Specialista Arte (EC9155)', 'semi_auto',
  true, false, false, true,
  ARRAY['51mm single','51mm double'], 14.0, 18.0, 1.5, 2.5,
  1, 8, 1, 8,
  'Built-in conical burr grinder with 8 settings. Sensor grinding technology. Active temperature control. My Latte Art steam wand. 51mm portafilter. Pre-infusion.'
),
(
  'De''Longhi', 'La Specialista Maestro (EC9665)', 'semi_auto',
  true, true, false, true,
  ARRAY['51mm single','51mm double'], 14.0, 18.0, 1.5, 2.5,
  1, 8, 1, 8,
  'Built-in grinder (8 settings). Smart tamping station. Dual heating system. 3 temperature settings. LatteCrema system. Pre-infusion. 51mm portafilter.'
),
(
  'De''Longhi', 'La Specialista Prestigio (EC9355)', 'semi_auto',
  true, true, false, true,
  ARRAY['51mm single','51mm double'], 14.0, 18.0, 1.5, 2.5,
  1, 8, 1, 8,
  'Built-in grinder 8 settings. Smart tamping station. 3 brew temperatures. Pre-infusion. LatteCrema auto milk. 51mm portafilter.'
),
(
  'De''Longhi', 'Dedica EC685', 'semi_auto',
  false, false, false, false,
  ARRAY['51mm single','51mm double'], 14.0, 16.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Slim 15cm design. No built-in grinder. 15 bar pump. Thermoblock heating. Manual steam wand. 51mm portafilter. Pressurized baskets included. Can be modded with bottomless portafilter.'
),
(
  'De''Longhi', 'Stilosa EC260', 'semi_auto',
  false, false, false, false,
  ARRAY['51mm single','51mm double'], 14.0, 16.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Budget entry-level. No grinder. 15 bar pump. Manual milk frothing. 51mm portafilter. Pressurized baskets.'
),
(
  'De''Longhi', 'Dinamica (ECAM350)', 'bean_to_cup',
  true, false, false, false,
  NULL, 7.0, 14.0, 1.5, 3.0,
  1, 13, 1, 13,
  'Bean-to-cup automatic. Built-in steel conical burr grinder (13 settings). LatteCrema system. Touchscreen. Multiple drink profiles. Adjustable strength and volume.'
),
(
  'De''Longhi', 'Magnifica S (ECAM250)', 'bean_to_cup',
  true, false, false, false,
  NULL, 7.0, 14.0, 1.5, 3.0,
  1, 13, 1, 13,
  'Compact bean-to-cup. 13-step grinder. Manual cappuccino system (steam wand). Adjustable coffee strength and temperature. Removable brew group.'
),
(
  'De''Longhi', 'Magnifica Evo (ECAM290)', 'bean_to_cup',
  true, false, false, false,
  NULL, 7.0, 14.0, 1.5, 3.0,
  1, 13, 1, 13,
  'Bean-to-cup with LatteCrema Hot. 13-step grinder. Soft-touch controls. Adjustable coffee strength, length, and temperature. Removable brew group.'
),
(
  'De''Longhi', 'Eletta Explore (ECAM450)', 'bean_to_cup',
  true, true, false, false,
  NULL, 7.0, 14.0, 1.5, 3.0,
  1, 13, 1, 13,
  'Premium bean-to-cup. 13-step grinder. Full colour touchscreen display. Over 40 drink recipes. LatteCrema system. Cold extraction technology. WiFi connected.'
),

-- ============================================================
-- GAGGIA
-- ============================================================
(
  'Gaggia', 'Classic Pro (2019)', 'semi_auto',
  false, false, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Classic Italian espresso machine. No grinder. Commercial 58mm group head. 9 bar OPV (adjustable). Solenoid valve. Single boiler. Rocker switches. Great for modding (PID, OPV spring, IMS baskets).'
),
(
  'Gaggia', 'Classic Evo Pro', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Updated Classic with built-in PID temperature control and 9 bar OPV. 58mm group head. Adjustable temp via PID. Solenoid 3-way valve. No grinder.'
),

-- ============================================================
-- RANCILIO
-- ============================================================
(
  'Rancilio', 'Silvia', 'semi_auto',
  false, false, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Classic single boiler. No grinder. Commercial 58mm group head. Iron frame. Great temperature stability for single boiler. Iconic prosumer machine.'
),
(
  'Rancilio', 'Silvia Pro X', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler Silvia with PID temperature control. No grinder. 58mm group head. Brew and steam simultaneously. Shot timer. Temperature display.'
),

-- ============================================================
-- LELIT
-- ============================================================
(
  'Lelit', 'Anna (PL41TEM)', 'semi_auto',
  false, true, false, false,
  ARRAY['57mm single','57mm double'], 14.0, 18.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Entry-level with PID temperature control. No grinder. 57mm portafilter. Single boiler. Compact footprint. Great starter PID machine.'
),
(
  'Lelit', 'Bianca (PL162T)', 'semi_auto',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler E61. Flow control paddle for pressure profiling. PID temperature control. Pre-infusion via paddle. No grinder. LCC display. 58mm portafilter. Wooden accents.'
),
(
  'Lelit', 'Mara X (PL62X)', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger with innovative brew priority mode. No grinder. E61 group head. PID-controlled HX - no temperature surfing needed. 58mm portafilter.'
),
(
  'Lelit', 'MaraT (PL62T)', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. PID display for temperature monitoring. No grinder. 58mm portafilter. Stainless steel body. Classic Italian design.'
),
(
  'Lelit', 'Elizabeth (PL92T)', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler with LCC display and PID. No grinder. Pre-infusion programmable. 58mm portafilter. Saturated group head (not E61). Compact dual boiler.'
),
(
  'Lelit', 'Victoria (PL91T)', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with LCC display and PID. No grinder. Programmable pre-infusion. 58mm saturated group. Compact with advanced temp control.'
),

-- ============================================================
-- ECM
-- ============================================================
(
  'ECM', 'Classika', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with PID. No grinder. E61 group head. Vibration pump. 58mm portafilter. Made in Germany. Compact E61 design.'
),
(
  'ECM', 'Synchronika', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler E61. No grinder. PID temperature. Rotary pump. Pre-infusion. 58mm portafilter. Stainless steel. Made in Germany. Flow control kit available.'
),
(
  'ECM', 'Mechanika V Slim', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. No grinder. PID display. Vibration pump. Slim footprint. 58mm portafilter. Made in Germany.'
),

-- ============================================================
-- PROFITEC
-- ============================================================
(
  'Profitec', 'Pro 300', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler compact. No grinder. PID temperature control. 58mm portafilter. Made in Germany. Vibration pump. Compact dual boiler design.'
),
(
  'Profitec', 'Pro 400', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. No grinder. PID display. Vibration pump. 58mm portafilter. Made in Germany.'
),
(
  'Profitec', 'Pro 500', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. No grinder. PID. Vibration pump. 58mm portafilter. Made in Germany. Popular mid-range prosumer.'
),
(
  'Profitec', 'Pro 600', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler E61. No grinder. PID. Vibration pump. Pre-infusion. 58mm portafilter. Flow control kit available. Made in Germany.'
),
(
  'Profitec', 'Pro 700', 'semi_auto',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler E61. No grinder. PID. Rotary pump (plumbable). Pressure gauge. Pre-infusion. 58mm portafilter. Flow control kit available. Made in Germany.'
),

-- ============================================================
-- ROCKET
-- ============================================================
(
  'Rocket', 'Appartamento', 'semi_auto',
  false, false, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. No grinder. Vibration pump. Compact design for apartments. 58mm portafilter. 1.8L copper boiler. Made in Italy.'
),
(
  'Rocket', 'Mozzafiato Cronometro V', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. No grinder. PID display with shot timer. Vibration pump. 58mm portafilter. Made in Italy. Insulated boiler.'
),
(
  'Rocket', 'Giotto Cronometro V', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61. No grinder. PID display with shot timer. Vibration pump. 58mm portafilter. Made in Italy. 1.8L copper HX boiler.'
),
(
  'Rocket', 'R58 Cinquantotto', 'semi_auto',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler E61. No grinder. Dual PID controllers. Rotary pump (plumbable). Pressure profiling capable. Pre-infusion. 58mm portafilter. Made in Italy.'
),

-- ============================================================
-- LA MARZOCCO
-- ============================================================
(
  'La Marzocco', 'Linea Mini', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler. No grinder. Integrated brew group (not E61). PID temperature. Pre-infusion. 58mm portafilter. Connected via app. Made in Florence. Iconic design.'
),
(
  'La Marzocco', 'Linea Micra', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Compact dual boiler. No grinder. Integrated brew group. PID via app. Pre-infusion. 58mm portafilter. Smallest La Marzocco home machine. Connected.'
),
(
  'La Marzocco', 'GS3', 'semi_auto',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler. No grinder. Paddle for manual pressure profiling (MP version) or auto-volumetric (AV version). PID. Pre-infusion. 58mm. Saturated group. Made in Florence.'
),
(
  'La Marzocco', 'Leva', 'manual_lever',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Manual lever with dual boiler system. Direct spring lever for pressure profiling. PID temperature. 58mm portafilter. Made in Florence. Ultimate manual control.'
),

-- ============================================================
-- NUOVA SIMONELLI
-- ============================================================
(
  'Nuova Simonelli', 'Oscar II', 'semi_auto',
  false, false, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger. No grinder. Soft infusion system. 58mm portafilter. Programmable dose buttons. Made in Italy. Compact professional quality.'
),
(
  'Nuova Simonelli', 'Musica', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger. No grinder. LED version has PID and shot timer display. 58mm portafilter. Programmable. Made in Italy. Cup warmer on top.'
),

-- ============================================================
-- VICTORIA ARDUINO
-- ============================================================
(
  'Victoria Arduino', 'Eagle One Prima', 'semi_auto',
  false, true, false, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'NEO brewing system with gravimetric technology. No grinder. Temperature control. Pre-infusion. 58mm portafilter. App connected. Home version of commercial Eagle One.'
),

-- ============================================================
-- BEZZERA
-- ============================================================
(
  'Bezzera', 'BZ10', 'semi_auto',
  false, false, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with heat exchanger. No grinder. E61 group head. 58mm portafilter. Vibration pump. Made in Italy. Compact and reliable.'
),
(
  'Bezzera', 'BZ13 DE', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler. No grinder. Digital PID. E61 group head. 58mm portafilter. Rotary pump option. Made in Italy.'
),

-- ============================================================
-- QUICK MILL
-- ============================================================
(
  'Quick Mill', 'Silvano Evo', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with thermoblock for steam. No grinder. PID temperature control. 58mm portafilter. Vibration pump. Made in Italy. Dual system design.'
),

-- ============================================================
-- ASCASO
-- ============================================================
(
  'Ascaso', 'Dream PID', 'semi_auto',
  false, true, false, false,
  ARRAY['57mm single','57mm double'], 14.0, 18.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with PID. No grinder. 57mm portafilter. Thermoblock. Retro design with multiple colour options. Compact footprint.'
),
(
  'Ascaso', 'Steel DUO PID', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Dual boiler (thermoblock). No grinder. Dual PID. 58mm portafilter. Professional grade steam. Multi-function display. Made in Barcelona.'
),

-- ============================================================
-- LA PAVONI
-- ============================================================
(
  'La Pavoni', 'Europiccola', 'manual_lever',
  false, false, true, true,
  ARRAY['49mm single','51mm double'], 14.0, 16.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Classic manual lever. No grinder. Direct lever pressure control. Single boiler. 49/51mm basket. Pre-infusion by lever lift. Iconic Italian design since 1961. Small basket limits dose to 14-16g.'
),
(
  'La Pavoni', 'Professional', 'manual_lever',
  false, false, true, true,
  ARRAY['49mm single','51mm double'], 14.0, 16.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Larger version of Europiccola. Manual lever. No grinder. Pressure gauge. Larger boiler. 49/51mm basket. Direct lever pressure profiling. 14-16g dose.'
),

-- ============================================================
-- FLAIR
-- ============================================================
(
  'Flair', 'Flair 58', 'manual_lever',
  false, false, true, true,
  ARRAY['58mm'], 15.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Manual lever with standard 58mm portafilter. No grinder. Full pressure profiling via lever. Pressure gauge. Preheat with boiling water or electric module. Up to 9+ bar.'
),
(
  'Flair', 'Pro 2', 'manual_lever',
  false, false, true, true,
  ARRAY['Flair proprietary'], 14.0, 18.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Manual lever with pressure gauge. No grinder. Stainless steel brew head. Proprietary portafilter. Full pressure profiling. Portable. 14-18g dose.'
),
(
  'Flair', 'Classic', 'manual_lever',
  false, false, true, false,
  ARRAY['Flair proprietary'], 12.0, 16.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Entry-level manual lever. No grinder. No pressure gauge. Aluminium brew head. Portable and affordable. Pressurized and non-pressurized baskets available.'
),
(
  'Flair', 'Flair 58x', 'manual_lever',
  false, false, true, true,
  ARRAY['58mm'], 15.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Electric preheat version of Flair 58. Manual lever. 58mm portafilter. Pressure gauge. Detachable electric brew head heater. Full pressure profiling.'
),

-- ============================================================
-- CAFELAT
-- ============================================================
(
  'Cafelat', 'Robot', 'manual_lever',
  false, false, true, true,
  ARRAY['58mm'], 15.0, 18.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Manual lever with dual-arm design. No grinder. Pressure gauge. No electricity needed (manual preheat). 58mm basket. Full pressure profiling. Simple, durable, no seals to replace.'
),

-- ============================================================
-- JURA
-- ============================================================
(
  'Jura', 'E8', 'super_auto',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 6, 1, 6,
  'Super automatic. Built-in AromaG3 grinder (6 settings). One-touch operation for 17 specialties. P.E.P. extraction process. 64oz water tank. Touchscreen.'
),
(
  'Jura', 'Z10', 'super_auto',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 6, 1, 6,
  'Premium super automatic. Product Recognising Grinder (P.R.G.) with 6 settings. Hot and cold brew. 3D brewing for cold specialties. WiFi. Touchscreen.'
),
(
  'Jura', 'S8', 'super_auto',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 6, 1, 6,
  'Super automatic. AromaG3 grinder (6 settings). 15 specialties. P.E.P. extraction. Touchscreen. Fine foam technology. Compact design.'
),

-- ============================================================
-- BREVILLE (US-market naming for completeness)
-- ============================================================
(
  'Breville', 'Barista Express (BES870)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 16, 5, 10,
  'US-market version of Sage Barista Express. Built-in conical burr grinder (1-16 scale). 3 temperature settings. Pre-infusion. 54mm portafilter.'
),
(
  'Breville', 'Barista Pro (BES878)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 30, 8, 18,
  'US-market Sage Barista Pro. Built-in grinder 1-30. ThermoJet. 5 temperature settings. Digital display. Pre-infusion. 54mm portafilter.'
),
(
  'Breville', 'Barista Touch (BES880)', 'semi_auto',
  true, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  1, 30, 8, 18,
  'US-market Sage Barista Touch. Touchscreen. Built-in grinder 1-30. Auto milk texturing. ThermoJet. Pre-infusion. 54mm portafilter.'
),
(
  'Breville', 'Oracle (BES980)', 'semi_auto',
  true, true, true, true,
  ARRAY['58mm single','58mm double'], 19.0, 22.0, 1.5, 2.5,
  1, 45, 15, 30,
  'US-market Sage Oracle. Dual boiler with built-in grinder 1-45. Auto grind, dose, tamp. PID temp. Pressure control. 58mm portafilter.'
),
(
  'Breville', 'Oracle Touch (BES990)', 'semi_auto',
  true, true, true, true,
  ARRAY['58mm single','58mm double'], 19.0, 22.0, 1.5, 2.5,
  1, 45, 15, 30,
  'US-market Sage Oracle Touch. Touchscreen. Dual boiler. Built-in grinder 1-45. Auto everything. PID. 58mm portafilter.'
),
(
  'Breville', 'Dual Boiler (BES920)', 'semi_auto',
  false, true, true, true,
  ARRAY['58mm single','58mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'US-market Sage Dual Boiler. No grinder. True dual boiler. PID. Adjustable pre-infusion. Shot clock. 58mm portafilter.'
),
(
  'Breville', 'Bambino Plus (BES500)', 'semi_auto',
  false, false, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'US-market Sage Bambino Plus. No grinder. ThermoJet. Auto milk texturing. Pre-infusion. 54mm portafilter.'
),
(
  'Breville', 'Infuser (BES840)', 'semi_auto',
  false, true, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'US-market Sage Infuser. No grinder. PID temperature. Variable pre-infusion. 54mm portafilter.'
),

-- ============================================================
-- ADDITIONAL MACHINES
-- ============================================================
(
  'Lelit', 'Grace (PL81T)', 'semi_auto',
  false, true, false, false,
  ARRAY['57mm single','57mm double'], 14.0, 18.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with PID and LCC display. No grinder. 57mm portafilter. E61 group head. Vibration pump. Compact.'
),
(
  'Lelit', 'Glenda (PL41PLUST)', 'semi_auto',
  false, true, false, false,
  ARRAY['57mm single','57mm double'], 14.0, 18.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler with PID. No grinder. 57mm portafilter. Pressure gauge. Compact. Made in Italy.'
),
(
  'Rocket', 'Appartamento Copper', 'semi_auto',
  false, false, false, false,
  ARRAY['58mm single','58mm double'], 18.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Heat exchanger E61 with copper side panels. No grinder. 58mm portafilter. Vibration pump. Compact apartment-friendly design. Made in Italy.'
),
(
  'ECM', 'Puristika', 'semi_auto',
  false, true, false, false,
  ARRAY['58mm single','58mm double'], 16.0, 20.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Single boiler E61 with PID. No grinder. Vibration pump. 58mm portafilter. Ultra-compact. No steam wand (espresso-only focused). Made in Germany.'
),
(
  'Sage', 'Barista Lite (SES500)', 'semi_auto',
  false, false, false, true,
  ARRAY['54mm single','54mm double'], 18.0, 22.0, 1.5, 2.5,
  NULL, NULL, NULL, NULL,
  'Entry-level Sage. No grinder. ThermoJet. Pre-infusion. Auto milk texturing. 54mm portafilter. Same as Bambino Plus in some markets.'
),
(
  'Gaggia', 'Brera', 'super_auto',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 5, 1, 5,
  'Super automatic. Built-in ceramic burr grinder (5 settings). Pannarello steam wand. Adapts to different cup sizes. Compact.'
),
(
  'Gaggia', 'Cadorna Prestige', 'super_auto',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 10, 1, 10,
  'Super automatic. Built-in grinder (10 settings). Touchscreen. 14 drink options. Auto milk system. Adjustable coffee strength and length.'
),
(
  'De''Longhi', 'Rivelia (EXAM440)', 'bean_to_cup',
  true, true, false, false,
  NULL, 7.0, 14.0, 1.5, 3.0,
  1, 13, 1, 13,
  'Premium bean-to-cup with dual bean hoppers. 13-step grinder. LatteCrema Bi. Colour touchscreen. WiFi connected. Over 16 one-touch drinks.'
),
(
  'Philips', 'EP3246/70 3200 Series LatteGo', 'bean_to_cup',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 12, 1, 12,
  'Bean-to-cup. 12-step ceramic grinder. LatteGo milk system. 5 drinks. AquaClean filter. Touchscreen. Easy clean system.'
),
(
  'Philips', 'EP5447/90 5400 Series LatteGo', 'bean_to_cup',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 12, 1, 12,
  'Bean-to-cup. 12-step ceramic grinder. LatteGo milk system. 12 drinks. Colour touchscreen. CoffeeEQ app. AquaClean filter.'
),
(
  'Melitta', 'Barista TS Smart', 'bean_to_cup',
  true, false, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 5, 1, 5,
  'Bean-to-cup. Dual bean hopper. 5 grind settings. 21 drink recipes. Bluetooth app. Whisper-quiet grinder. Auto milk system.'
),
(
  'Siemens', 'EQ.9 Plus Connect', 'bean_to_cup',
  true, true, false, false,
  NULL, 7.0, 12.0, 1.5, 3.0,
  1, 10, 1, 10,
  'Premium bean-to-cup. Dual bean hopper. SensoFlow heating. 10-step ceramic grinder. WiFi via Home Connect app. autoMilk Clean. Barista mode.'
)

ON CONFLICT DO NOTHING;
