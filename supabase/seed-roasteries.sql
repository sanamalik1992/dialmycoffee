-- ============================================================
-- DialMyCoffee - Seed: Roasteries (200+ worldwide)
-- Requires seed-countries.sql to be run first.
-- ============================================================

-- ============================================================
-- UNITED KINGDOM (50+ roasteries)
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Square Mile Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://squaremilecoffee.com', true, ARRAY['Square Mile']),
('Monmouth Coffee Company', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://monmouthcoffee.co.uk', true, ARRAY['Monmouth']),
('Origin Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Cornwall', 'https://origincoffee.co.uk', true, ARRAY['Origin']),
('Dark Arts Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://darkartscoffee.co.uk', true, ARRAY['Dark Arts']),
('Assembly Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://assemblycoffee.co.uk', true, ARRAY['Assembly']),
('Hasbean Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Stafford', 'https://hasbean.co.uk', true, ARRAY['Hasbean','Has Bean']),
('Workshop Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://workshopcoffee.com', true, ARRAY['Workshop']),
('Colonna Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Bath', 'https://colonnacoffee.com', true, ARRAY['Colonna']),
('Round Hill Roastery', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Bath', 'https://roundhillroastery.com', true, ARRAY['Round Hill']),
('Rave Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Cirencester', 'https://ravecoffee.co.uk', true, ARRAY['Rave']),
('Allpress Espresso UK', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://uk.allpressespresso.com', true, ARRAY['Allpress','Allpress UK']),
('Union Hand-Roasted Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://unionroasted.com', true, ARRAY['Union','Union Hand-Roasted']),
('Notes Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://notesroastery.com', true, ARRAY['Notes']),
('Ozone Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://ozonecoffee.co.uk', true, ARRAY['Ozone']),
('Climpson & Sons', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://climpsonandsons.com', true, ARRAY['Climpson','Climpsons']),
('Kiss the Hippo', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://kissthehippo.com', true, ARRAY['Kiss The Hippo','KTH']),
('Plot Roasting', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://plotroasting.com', true, ARRAY['Plot']),
('Caravan Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://caravancoffee.co.uk', true, ARRAY['Caravan']),
('Coleman Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://colemancoffee.com', false, ARRAY['Coleman']),
('Campbell & Syme', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Edinburgh', 'https://campbellandsyme.com', false, ARRAY['Campbell and Syme']),
('Glen Lyon Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Aberfeldy', 'https://glenlyoncoffee.co.uk', false, ARRAY['Glen Lyon']),
('Dear Green Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Glasgow', 'https://deargreencoffee.com', true, ARRAY['Dear Green']),
('Papercup Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Glasgow', 'https://papercupcoffee.co.uk', false, ARRAY['Papercup']),
('Machina Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Edinburgh', 'https://machinacoffee.co.uk', false, ARRAY['Machina']),
('Fortitude Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Edinburgh', 'https://fortitudecoffee.com', false, ARRAY['Fortitude']),
('Chimney Fire Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Somerset', 'https://chimneyfirecoffee.com', false, ARRAY['Chimney Fire']),
('Pharmacie Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://pharmaciecoffee.com', false, ARRAY['Pharmacie']),
('Quarter Horse Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Birmingham', 'https://quarterhorsecoffee.com', false, ARRAY['Quarter Horse']),
('200 Degrees Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Nottingham', 'https://200degs.com', true, ARRAY['200 Degrees','200 Degs']),
('Pact Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://pactcoffee.com', true, ARRAY['Pact']),
('Atkinsons Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Lancaster', 'https://thecoffeehopper.com', false, ARRAY['Atkinsons']),
('Grindsmith', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Manchester', 'https://grindsmith.com', false, ARRAY['Grind Smith']),
('North Star Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Leeds', 'https://northstarroast.com', true, ARRAY['North Star']),
('Casa Espresso', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Bradford', 'https://casaespresso.co.uk', false, ARRAY['Casa']),
('Extract Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Bristol', 'https://extractcoffee.co.uk', true, ARRAY['Extract']),
('Crankhouse Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Exeter', 'https://crankhousecoffee.co.uk', false, ARRAY['Crankhouse']),
('Django Coffee Co', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Oxfordshire', 'https://djangocoffee.co.uk', false, ARRAY['Django']),
('Curve Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Margate', 'https://curveroasters.co.uk', false, ARRAY['Curve']),
('Hundred House Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Shropshire', 'https://hundredhousecoffee.com', false, ARRAY['Hundred House']),
('Rounton Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'North Yorkshire', 'https://rountoncoffee.co.uk', false, ARRAY['Rounton']),
('Butterworth & Son', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Hove', 'https://butterworthandson.com', false, ARRAY['Butterworth']),
('Girls Who Grind Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Poole', 'https://girlswhograindcoffee.com', true, ARRAY['GWG','Girls Who Grind']),
('Horsham Coffee Roaster', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Horsham', 'https://horshamcoffeeroaster.co.uk', false, ARRAY['Horsham']),
('Redemption Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://redemptionroasters.com', false, ARRAY['Redemption']),
('New Ground Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://newgroundcoffee.com', false, ARRAY['New Ground']),
('Smith Street Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'London', 'https://smithstreetcoffee.co.uk', false, ARRAY['Smith Street']),
('ManCoCo', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Manchester', 'https://mancoco.co.uk', false, ARRAY['Manchester Coffee Company']),
('Clifton Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Bristol', 'https://cliftoncoffee.co.uk', true, ARRAY['Clifton']),
('Bailies Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Belfast', 'https://bailiescoffee.com', false, ARRAY['Bailies']),
('Obadiah Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Edinburgh', 'https://obadiahcoffee.com', false, ARRAY['Obadiah']),
('Hard Lines Coffee', (SELECT id FROM countries WHERE iso2 = 'GB'), 'Cardiff', 'https://hardlinescoffee.co.uk', false, ARRAY['Hard Lines']),
('3fe Coffee', (SELECT id FROM countries WHERE iso2 = 'IE'), 'Dublin', 'https://3fe.com', true, ARRAY['3FE','Three FE']),
('Calendar Coffee', (SELECT id FROM countries WHERE iso2 = 'IE'), 'Galway', 'https://calendarcoffee.ie', false, ARRAY['Calendar'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- UNITED STATES (40+ roasteries)
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Onyx Coffee Lab', (SELECT id FROM countries WHERE iso2 = 'US'), 'Rogers, AR', 'https://onyxcoffeelab.com', true, ARRAY['Onyx']),
('Counter Culture Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Durham, NC', 'https://counterculturecoffee.com', true, ARRAY['Counter Culture']),
('Intelligentsia Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Chicago, IL', 'https://intelligentsia.com', true, ARRAY['Intelligentsia','Intelli']),
('Blue Bottle Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Oakland, CA', 'https://bluebottlecoffee.com', true, ARRAY['Blue Bottle']),
('Stumptown Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Portland, OR', 'https://stumptowncoffee.com', true, ARRAY['Stumptown']),
('Verve Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Santa Cruz, CA', 'https://vervecoffee.com', true, ARRAY['Verve']),
('Heart Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Portland, OR', 'https://heartcoffee.com', true, ARRAY['Heart']),
('George Howell Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Acton, MA', 'https://georgehowellcoffee.com', true, ARRAY['George Howell']),
('Proud Mary Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Portland, OR', 'https://proudmarycoffee.com', true, ARRAY['Proud Mary US']),
('La Colombe Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Philadelphia, PA', 'https://lacolombe.com', true, ARRAY['La Colombe']),
('Equator Coffees', (SELECT id FROM countries WHERE iso2 = 'US'), 'San Rafael, CA', 'https://equatorcoffees.com', true, ARRAY['Equator']),
('Cat & Cloud Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Santa Cruz, CA', 'https://catandcloud.com', true, ARRAY['Cat and Cloud']),
('Methodical Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Greenville, SC', 'https://methodicalcoffee.com', true, ARRAY['Methodical']),
('Black & White Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Wake Forest, NC', 'https://blackwhiteroasters.com', true, ARRAY['Black and White','B&W']),
('Sey Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Brooklyn, NY', 'https://seycoffee.com', true, ARRAY['Sey']),
('Devocion', (SELECT id FROM countries WHERE iso2 = 'US'), 'Brooklyn, NY', 'https://dfranciaespresso.com', true, ARRAY['Devocion US']),
('Parlor Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Brooklyn, NY', 'https://parlorcoffee.com', true, ARRAY['Parlor']),
('Brandywine Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Wilmington, DE', 'https://brandywinecoffeeroasters.com', true, ARRAY['Brandywine']),
('Tandem Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Portland, ME', 'https://tandemcoffee.com', false, ARRAY['Tandem']),
('Ruby Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Nelsonville, WI', 'https://rubycoffeeroasters.com', true, ARRAY['Ruby']),
('Little Wolf Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Ipswich, MA', 'https://littlewolfcoffee.com', false, ARRAY['Little Wolf']),
('Regalia Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Phoenix, AZ', 'https://regaliacoffee.com', false, ARRAY['Regalia']),
('Ceremony Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Annapolis, MD', 'https://ceremonycoffee.com', true, ARRAY['Ceremony']),
('Sightglass Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'San Francisco, CA', 'https://sightglasscoffee.com', true, ARRAY['Sightglass']),
('Ritual Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'San Francisco, CA', 'https://ritualroasters.com', true, ARRAY['Ritual']),
('Four Barrel Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'San Francisco, CA', 'https://fourbarrelcoffee.com', false, ARRAY['Four Barrel']),
('Coava Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Portland, OR', 'https://coavacoffee.com', true, ARRAY['Coava']),
('Madcap Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Grand Rapids, MI', 'https://madcapcoffee.com', true, ARRAY['Madcap']),
('PT''s Coffee Roasting Co', (SELECT id FROM countries WHERE iso2 = 'US'), 'Topeka, KS', 'https://ptscoffee.com', false, ARRAY['PTs','PT''s']),
('Temple Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Sacramento, CA', 'https://templecoffee.com', false, ARRAY['Temple']),
('Kickapoo Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Viroqua, WI', 'https://kickapoocoffee.com', false, ARRAY['Kickapoo']),
('Olympia Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Olympia, WA', 'https://olympiacoffee.com', true, ARRAY['Olympia']),
('Camber Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Bellingham, WA', 'https://cambercoffee.com', false, ARRAY['Camber']),
('Klatch Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Rancho Cucamonga, CA', 'https://klatchcoffee.com', false, ARRAY['Klatch']),
('Chromatic Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'San Jose, CA', 'https://chromaticcoffee.com', false, ARRAY['Chromatic']),
('Huckleberry Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Denver, CO', 'https://huckleberryroasters.com', false, ARRAY['Huckleberry']),
('Kuma Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Seattle, WA', 'https://kumacoffee.com', false, ARRAY['Kuma']),
('Merit Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'San Antonio, TX', 'https://meritcoffee.com', false, ARRAY['Merit']),
('Narrative Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Everett, WA', 'https://narrativecoffee.com', false, ARRAY['Narrative']),
('Passenger Coffee', (SELECT id FROM countries WHERE iso2 = 'US'), 'Lancaster, PA', 'https://passengercoffee.com', true, ARRAY['Passenger']),
('Elm Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Seattle, WA', 'https://elmcoffeeroasters.com', false, ARRAY['Elm']),
('Sweet Bloom Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Lakewood, CO', 'https://sweetbloomcoffee.com', false, ARRAY['Sweet Bloom']),
('Slate Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Seattle, WA', 'https://slatecoffee.com', false, ARRAY['Slate']),
('Dragonfly Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'US'), 'Henderson, NV', 'https://dragonflycoffeeroasters.com', false, ARRAY['Dragonfly'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- GERMANY
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('The Barn', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Berlin', 'https://thebarn.de', true, ARRAY['The Barn Berlin']),
('Five Elephant', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Berlin', 'https://fiveelephant.com', true, ARRAY['Five Elephant Berlin']),
('Bonanza Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Berlin', 'https://bonanzacoffee.de', true, ARRAY['Bonanza']),
('Father Carpenter', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Berlin', 'https://fathercarpenter.com', false, ARRAY['Father Carpenter Berlin']),
('Coffee Circle', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Berlin', 'https://coffeecircle.com', false, ARRAY['Coffee Circle']),
('JB Kaffee', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Berlin', 'https://jbkaffee.de', false, ARRAY['JB']),
('Man Versus Machine', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Munich', 'https://manversusmachine.de', true, ARRAY['MVM']),
('Public Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Hamburg', 'https://publiccoffeeroasters.com', false, ARRAY['Public Coffee']),
('Elbgold', (SELECT id FROM countries WHERE iso2 = 'DE'), 'Hamburg', 'https://elbgold.com', false, ARRAY['Elbgold Hamburg'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- NETHERLANDS
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Friedhats', (SELECT id FROM countries WHERE iso2 = 'NL'), 'Amsterdam', 'https://friedhats.com', true, ARRAY['Friedhats Amsterdam']),
('White Label Coffee', (SELECT id FROM countries WHERE iso2 = 'NL'), 'Amsterdam', 'https://whitelabelcoffee.nl', false, ARRAY['White Label']),
('Bocca Coffee', (SELECT id FROM countries WHERE iso2 = 'NL'), 'Amsterdam', 'https://bocca.nl', true, ARRAY['Bocca']),
('Lot Sixty One Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'NL'), 'Amsterdam', 'https://lotsixtyone.com', false, ARRAY['Lot Sixty One','Lot 61']),
('Rum Baba', (SELECT id FROM countries WHERE iso2 = 'NL'), 'Amsterdam', 'https://rfrumbaba.nl', false, ARRAY['Rum Baba Amsterdam']),
('Headfirst Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'NL'), 'Amsterdam', 'https://headfirstcoffeeroasters.com', false, ARRAY['Headfirst'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SWEDEN
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Drop Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'SE'), 'Stockholm', 'https://dropcoffee.com', true, ARRAY['Drop Coffee','Drop']),
('Koppi Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'SE'), 'Helsingborg', 'https://koppi.se', true, ARRAY['Koppi']),
('da Matteo', (SELECT id FROM countries WHERE iso2 = 'SE'), 'Gothenburg', 'https://damatteo.se', true, ARRAY['Da Matteo']),
('Johan & Nystrom', (SELECT id FROM countries WHERE iso2 = 'SE'), 'Stockholm', 'https://johanochnystrom.se', true, ARRAY['Johan and Nystrom','Johan & Nystroem'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- NORWAY
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Tim Wendelboe', (SELECT id FROM countries WHERE iso2 = 'NO'), 'Oslo', 'https://timwendelboe.no', true, ARRAY['TW']),
('Fuglen Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'NO'), 'Oslo', 'https://fuglen.com', true, ARRAY['Fuglen Oslo']),
('Supreme Roastworks', (SELECT id FROM countries WHERE iso2 = 'NO'), 'Oslo', 'https://srw.no', true, ARRAY['Supreme','SRW']),
('Solberg & Hansen', (SELECT id FROM countries WHERE iso2 = 'NO'), 'Oslo', 'https://solberghansenno.com', false, ARRAY['Solberg and Hansen']),
('Talormade', (SELECT id FROM countries WHERE iso2 = 'NO'), 'Oslo', 'https://talormade.no', false, ARRAY['Talor Made'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- DENMARK
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Coffee Collective', (SELECT id FROM countries WHERE iso2 = 'DK'), 'Copenhagen', 'https://coffeecollective.dk', true, ARRAY['The Coffee Collective']),
('La Cabra', (SELECT id FROM countries WHERE iso2 = 'DK'), 'Aarhus', 'https://lacabra.dk', true, ARRAY['La Cabra Coffee']),
('April Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'DK'), 'Copenhagen', 'https://aprilcoffeeroasters.com', true, ARRAY['April']),
('Prolog Coffee', (SELECT id FROM countries WHERE iso2 = 'DK'), 'Copenhagen', 'https://prologcoffee.com', false, ARRAY['Prolog'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- FINLAND
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Kaffa Roastery', (SELECT id FROM countries WHERE iso2 = 'FI'), 'Helsinki', 'https://kaffa.fi', true, ARRAY['Kaffa']),
('Good Life Coffee', (SELECT id FROM countries WHERE iso2 = 'FI'), 'Helsinki', 'https://goodlifecoffee.fi', false, ARRAY['Good Life']),
('Lehmus Roastery', (SELECT id FROM countries WHERE iso2 = 'FI'), 'Tampere', 'https://lehmusroastery.fi', false, ARRAY['Lehmus'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- ITALY
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Gardelli Specialty Coffees', (SELECT id FROM countries WHERE iso2 = 'IT'), 'Forli', 'https://gardfranciaelli.it', true, ARRAY['Gardelli']),
('Ditta Artigianale', (SELECT id FROM countries WHERE iso2 = 'IT'), 'Florence', 'https://dittaartigianale.it', true, ARRAY['Ditta']),
('Orsonero Coffee', (SELECT id FROM countries WHERE iso2 = 'IT'), 'Milan', 'https://orfrancianero.com', false, ARRAY['Orsonero']),
('Rubens Gardelli', (SELECT id FROM countries WHERE iso2 = 'IT'), 'Forli', NULL, false, ARRAY['Rubens']),
('Café do Brasil by Lavazza', (SELECT id FROM countries WHERE iso2 = 'IT'), 'Turin', 'https://lavazza.com', false, ARRAY['Lavazza'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SPAIN
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Right Side Coffee', (SELECT id FROM countries WHERE iso2 = 'ES'), 'Barcelona', 'https://rightsidecoffee.com', true, ARRAY['Right Side']),
('Nomad Coffee', (SELECT id FROM countries WHERE iso2 = 'ES'), 'Barcelona', 'https://nomadcoffee.es', true, ARRAY['Nomad']),
('Satan''s Coffee Corner', (SELECT id FROM countries WHERE iso2 = 'ES'), 'Barcelona', 'https://satanscoffee.com', true, ARRAY['Satan''s','Satans']),
('Hola Coffee', (SELECT id FROM countries WHERE iso2 = 'ES'), 'Madrid', 'https://holacoffee.com', false, ARRAY['Hola']),
('Tres Cabezas', (SELECT id FROM countries WHERE iso2 = 'ES'), 'Barcelona', NULL, false, ARRAY['3 Cabezas'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- FRANCE
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Belleville Brulerie', (SELECT id FROM countries WHERE iso2 = 'FR'), 'Paris', 'https://cafesbelleville.com', true, ARRAY['Belleville']),
('Coutume Cafe', (SELECT id FROM countries WHERE iso2 = 'FR'), 'Paris', 'https://coutumecafe.com', true, ARRAY['Coutume']),
('Lomi Roasters', (SELECT id FROM countries WHERE iso2 = 'FR'), 'Paris', 'https://lfranciaomi.paris', true, ARRAY['Lomi']),
('KB CafeShop', (SELECT id FROM countries WHERE iso2 = 'FR'), 'Paris', NULL, false, ARRAY['KB','Koffee Bar']),
('Hexagone Cafe', (SELECT id FROM countries WHERE iso2 = 'FR'), 'Paris', 'https://hexagonecafe.com', false, ARRAY['Hexagone'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SWITZERLAND
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Mame Coffee', (SELECT id FROM countries WHERE iso2 = 'CH'), 'Zurich', 'https://mamecoffee.com', true, ARRAY['Mame']),
('Rast Kaffee', (SELECT id FROM countries WHERE iso2 = 'CH'), 'Zurich', 'https://rastkaffee.ch', false, ARRAY['Rast'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- AUSTRIA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('CaffeCouture', (SELECT id FROM countries WHERE iso2 = 'AT'), 'Vienna', 'https://caffecouture.com', false, ARRAY['Caffe Couture']),
('Jonas Reindl Coffee', (SELECT id FROM countries WHERE iso2 = 'AT'), 'Vienna', 'https://jonasreindl.at', false, ARRAY['Jonas Reindl'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- BELGIUM
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Mok Coffee', (SELECT id FROM countries WHERE iso2 = 'BE'), 'Antwerp', 'https://mokcoffee.be', false, ARRAY['MOK']),
('Caffenation', (SELECT id FROM countries WHERE iso2 = 'BE'), 'Antwerp', 'https://caffenation.be', false, ARRAY['Caffenation Antwerp'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- PORTUGAL
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Fabrica Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'PT'), 'Lisbon', 'https://fabricacoffeeroasters.com', false, ARRAY['Fabrica']),
('Copenhagen Coffee Lab', (SELECT id FROM countries WHERE iso2 = 'PT'), 'Lisbon', 'https://copenhagencoffeelab.com', false, ARRAY['Copenhagen Coffee Lab Lisbon'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- POLAND
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Audun Coffee', (SELECT id FROM countries WHERE iso2 = 'PL'), 'Krakow', 'https://audun.coffee', false, ARRAY['Audun']),
('Hard Beans', (SELECT id FROM countries WHERE iso2 = 'PL'), 'Opole', 'https://hardbeans.pl', false, ARRAY['Hard Beans Opole'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- CZECHIA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Doubleshot Coffee', (SELECT id FROM countries WHERE iso2 = 'CZ'), 'Prague', 'https://doubleshot.cz', false, ARRAY['Doubleshot']),
('EMA Espresso Bar', (SELECT id FROM countries WHERE iso2 = 'CZ'), 'Prague', NULL, false, ARRAY['EMA'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- AUSTRALIA (20+ roasteries)
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Market Lane Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://marketlane.com.au', true, ARRAY['Market Lane']),
('Seven Seeds Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://sevenseeds.com.au', true, ARRAY['Seven Seeds']),
('Proud Mary Coffee AU', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://proudmarycoffee.com.au', true, ARRAY['Proud Mary Australia']),
('Single O', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Sydney', 'https://singleo.com.au', true, ARRAY['Single Origin Roasters']),
('ONA Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Canberra', 'https://onacoffee.com.au', true, ARRAY['ONA','Ona']),
('Dukes Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://dukescoffee.com.au', true, ARRAY['Dukes']),
('Code Black Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://codeblackcoffee.com.au', true, ARRAY['Code Black']),
('Padre Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://padrecoffee.com.au', true, ARRAY['Padre']),
('Small Batch Roasting Co', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://smallbatchroasting.com.au', false, ARRAY['Small Batch']),
('Wide Open Road Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://wideopenroadcoffee.com', false, ARRAY['Wide Open Road']),
('Industry Beans', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://industrybeans.com', true, ARRAY['Industry Beans Melbourne']),
('St Ali Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://stali.com.au', true, ARRAY['St Ali']),
('Axil Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://axilcoffee.com.au', false, ARRAY['Axil']),
('Mecca Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Sydney', 'https://mfranciaeccacoffee.com.au', false, ARRAY['Mecca']),
('Sample Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Sydney', 'https://samplecoffee.com.au', false, ARRAY['Sample']),
('Campos Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Sydney', 'https://camposcoffee.com', true, ARRAY['Campos']),
('Normcore Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://normcorecoffee.com.au', false, ARRAY['Normcore']),
('Veneziano Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://venezianocoffee.com.au', false, ARRAY['Veneziano']),
('Five Senses Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Melbourne', 'https://fivesenses.com.au', false, ARRAY['Five Senses']),
('Toby''s Estate Coffee', (SELECT id FROM countries WHERE iso2 = 'AU'), 'Sydney', 'https://tobysestate.com.au', false, ARRAY['Tobys Estate','Toby''s Estate'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- NEW ZEALAND
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Allpress Espresso NZ', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Auckland', 'https://allpressespresso.com', true, ARRAY['Allpress NZ']),
('Flight Coffee', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Wellington', 'https://flightcoffee.co.nz', true, ARRAY['Flight']),
('Havana Coffee Works', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Wellington', 'https://havana.co.nz', false, ARRAY['Havana']),
('Supreme Coffee NZ', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Wellington', 'https://supreme.co.nz', true, ARRAY['Supreme NZ']),
('Kokako Coffee', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Auckland', 'https://kokako.co.nz', false, ARRAY['Kokako']),
('Coffee Supreme', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Wellington', 'https://coffeesupreme.com', false, ARRAY['Coffee Supreme NZ']),
('Peoples Coffee', (SELECT id FROM countries WHERE iso2 = 'NZ'), 'Wellington', 'https://peoplescoffee.co.nz', false, ARRAY['People''s Coffee'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- JAPAN
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Fuglen Tokyo', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Tokyo', 'https://fuglen.com', true, ARRAY['Fuglen Japan']),
('Onibus Coffee', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Tokyo', 'https://onibuscoffee.com', true, ARRAY['Onibus']),
('% Arabica Kyoto', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Kyoto', 'https://arabica.coffee', true, ARRAY['Arabica','Percent Arabica']),
('Kurasu Coffee', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Kyoto', 'https://kurfranciaasu.kyoto', true, ARRAY['Kurasu']),
('Sarutahiko Coffee', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Tokyo', 'https://sarutahiko.co', false, ARRAY['Sarutahiko']),
('Glitch Coffee & Roasters', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Tokyo', 'https://glfranciaitch.coffee', false, ARRAY['Glitch']),
('Koffee Mameya', (SELECT id FROM countries WHERE iso2 = 'JP'), 'Tokyo', NULL, true, ARRAY['Koffee Mameya Kakeru'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SOUTH KOREA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Fritz Coffee Company', (SELECT id FROM countries WHERE iso2 = 'KR'), 'Seoul', 'https://fritz.co.kr', true, ARRAY['Fritz']),
('Namusairo Coffee', (SELECT id FROM countries WHERE iso2 = 'KR'), 'Seoul', NULL, false, ARRAY['Namusairo']),
('Anthracite Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'KR'), 'Seoul', NULL, false, ARRAY['Anthracite'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SINGAPORE
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Common Man Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'SG'), 'Singapore', 'https://commonmancoffee.com', true, ARRAY['Common Man']),
('Nylon Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'SG'), 'Singapore', 'https://nfranciaylon.coffee', true, ARRAY['Nylon']),
('PPP Coffee', (SELECT id FROM countries WHERE iso2 = 'SG'), 'Singapore', 'https://pppcoffee.com', false, ARRAY['PPP']),
('Apartment Coffee', (SELECT id FROM countries WHERE iso2 = 'SG'), 'Singapore', NULL, false, ARRAY['Apartment'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- HONG KONG
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('NOC Coffee Co', (SELECT id FROM countries WHERE iso2 = 'HK'), 'Hong Kong', 'https://nfranciaoc-coffee.com', true, ARRAY['NOC']),
('Cupping Room Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'HK'), 'Hong Kong', 'https://cuppfranciaingroom.hk', false, ARRAY['Cupping Room','The Cupping Room'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- TAIWAN
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Simple Kaffa', (SELECT id FROM countries WHERE iso2 = 'TW'), 'Taipei', 'https://simplekaffa.com', true, ARRAY['Simple Kaffa Taipei'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- THAILAND
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Roots Coffee Roaster', (SELECT id FROM countries WHERE iso2 = 'TH'), 'Bangkok', 'https://rootsbkk.com', false, ARRAY['Roots BKK'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- UNITED ARAB EMIRATES / MIDDLE EAST
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('% Arabica Dubai', (SELECT id FROM countries WHERE iso2 = 'AE'), 'Dubai', 'https://arabica.coffee', true, ARRAY['Arabica Dubai','Percent Arabica Dubai']),
('RAW Coffee Company', (SELECT id FROM countries WHERE iso2 = 'AE'), 'Dubai', 'https://rawcoffeecompany.com', true, ARRAY['RAW']),
('Nightjar Coffee', (SELECT id FROM countries WHERE iso2 = 'AE'), 'Dubai', 'https://nightjarcoffee.com', true, ARRAY['Nightjar']),
('The Espresso Lab', (SELECT id FROM countries WHERE iso2 = 'AE'), 'Dubai', 'https://theespressolab.com', false, ARRAY['Espresso Lab Dubai']),
('Mokha 1450', (SELECT id FROM countries WHERE iso2 = 'AE'), 'Dubai', 'https://mokha1450.com', false, ARRAY['Mokha'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAUDI ARABIA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Elixir Bunn', (SELECT id FROM countries WHERE iso2 = 'SA'), 'Riyadh', 'https://elixirbunn.com', false, ARRAY['Elixir Bunn Riyadh']),
('Barn''s Coffee', (SELECT id FROM countries WHERE iso2 = 'SA'), 'Jeddah', NULL, false, ARRAY['Barns'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- COLOMBIA / SOUTH AMERICA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Devocion Colombia', (SELECT id FROM countries WHERE iso2 = 'CO'), 'Bogota', 'https://devocion.com', true, ARRAY['Devocion Bogota']),
('Azahar Coffee', (SELECT id FROM countries WHERE iso2 = 'CO'), 'Bogota', 'https://azaharcoffee.com', false, ARRAY['Azahar']),
('Pergamino Cafe', (SELECT id FROM countries WHERE iso2 = 'CO'), 'Medellin', 'https://pergamino.co', false, ARRAY['Pergamino'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- BRAZIL
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Coffee Lab', (SELECT id FROM countries WHERE iso2 = 'BR'), 'Sao Paulo', 'https://coffeelab.com.br', false, ARRAY['Coffee Lab Brazil']),
('Um Coffee Co', (SELECT id FROM countries WHERE iso2 = 'BR'), 'Sao Paulo', NULL, false, ARRAY['Um Coffee'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- CANADA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Phil & Sebastian Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Calgary', 'https://philsebastian.com', true, ARRAY['Phil and Sebastian','P&S']),
('Pilot Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Toronto', 'https://pilotcoffeeroasters.com', true, ARRAY['Pilot']),
('49th Parallel Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Vancouver', 'https://49thcoffee.com', true, ARRAY['49th Parallel']),
('Detour Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Hamilton', 'https://detourcoffee.com', true, ARRAY['Detour']),
('Monogram Coffee', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Calgary', 'https://monfranciaogramcoffee.com', true, ARRAY['Monogram']),
('Transcend Coffee', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Edmonton', 'https://transcendcoffee.com', false, ARRAY['Transcend']),
('Hatch Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Toronto', 'https://hatchcrafted.com', false, ARRAY['Hatch']),
('Social Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'CA'), 'Toronto', NULL, false, ARRAY['Social'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- SOUTH AFRICA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Father Coffee', (SELECT id FROM countries WHERE iso2 = 'ZA'), 'Johannesburg', 'https://fathercoffee.com', true, ARRAY['Father']),
('Rosetta Roastery', (SELECT id FROM countries WHERE iso2 = 'ZA'), 'Cape Town', 'https://rosettaroastery.com', true, ARRAY['Rosetta']),
('Truth Coffee Roasting', (SELECT id FROM countries WHERE iso2 = 'ZA'), 'Cape Town', 'https://truthcoffee.com', true, ARRAY['Truth']),
('Origin Coffee Roasting SA', (SELECT id FROM countries WHERE iso2 = 'ZA'), 'Cape Town', 'https://origincoffee.co.za', false, ARRAY['Origin SA']),
('Deluxe Coffeeworks', (SELECT id FROM countries WHERE iso2 = 'ZA'), 'Cape Town', 'https://deluxecoffeeworks.co.za', false, ARRAY['Deluxe'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- KENYA / EAST AFRICA
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Kestrel Coffee Roasters', (SELECT id FROM countries WHERE iso2 = 'KE'), 'Nairobi', NULL, false, ARRAY['Kestrel'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- MEXICO
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Buna Coffee', (SELECT id FROM countries WHERE iso2 = 'MX'), 'Mexico City', 'https://bfranciauna.mx', false, ARRAY['Buna']),
('Cafe Avellaneda', (SELECT id FROM countries WHERE iso2 = 'MX'), 'Mexico City', NULL, false, ARRAY['Avellaneda'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- GREECE
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Taf Coffee', (SELECT id FROM countries WHERE iso2 = 'GR'), 'Athens', 'https://tfranciaafcoffee.gr', false, ARRAY['TAF'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- TURKEY
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Petra Roasting Co', (SELECT id FROM countries WHERE iso2 = 'TR'), 'Istanbul', 'https://petraroastingco.com', false, ARRAY['Petra']),
('Kronotrop Coffee', (SELECT id FROM countries WHERE iso2 = 'TR'), 'Istanbul', 'https://kronotrop.com.tr', false, ARRAY['Kronotrop'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- ICELAND
-- ============================================================
INSERT INTO roasteries (name, country_id, city, website, is_popular, aliases) VALUES
('Reykjavik Roasters', (SELECT id FROM countries WHERE iso2 = 'IS'), 'Reykjavik', 'https://reykjavikroasters.is', false, ARRAY['Reykjavik Roasters IS'])
ON CONFLICT DO NOTHING;
