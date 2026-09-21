<?php

namespace App\Http\Controllers;

use App\Models\CmsPage;
use App\Models\Registration;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SummitController extends Controller
{
    public function index()
    {
        $eventDetails = [
            'name' => 'MARPORTS GLOBAL 2027',
            'edition' => 'Conference & Excellence Awards',
            'date' => '5th February 2027',
            'venue' => 'Taj Coromandel',
            'city' => 'Chennai',
            'state' => 'Tamil Nadu',
            'country' => 'India',
            'organizer' => 'E HUB EVENTS PRIVATE LIMITED',
            'organizer_url' => 'https://www.ehub.events',
            'email' => 'jayadev@marportsglobal.com',
            'awards_email' => 'awards@marportsglobal.com',
            'phone' => '+91 9633958465',
            'registration_url' => 'https://ehub.events/events?register=marports',
        ];

        // 4 Core Conference Topics strictly copied from marportsglobal.com/conference-topics
        $conferenceTopics = [
            [
                'number' => '01',
                'title' => 'Sustainable, Green, and Resilient Shipping',
                'description' => 'Navigating regulatory challenges, decarbonization roadmaps, and the future of resilient ocean supply chains.',
                'points' => [
                    'Global shipping outlook & trade perspectives from shipowners',
                    'Advancing green and sustainable shipping strategies',
                    'Fleet optimization: routing, fuel efficiency, predictive maintenance',
                    'Shipowner-port partnerships for operational excellence',
                ],
            ],
            [
                'number' => '02',
                'title' => 'Port Infrastructure and Strategic Initiatives',
                'description' => 'Future-proofing port assets, climate resilience, and establishing integrated maritime energy hubs.',
                'points' => [
                    'Innovative port design, capacity expansion, and safety enhancements',
                    'Climate resilience and future-proofing infrastructure',
                    'Collaborative port-led development and support infrastructure',
                    'Port-based renewable energy, bunkering, and green hydrogen initiatives',
                ],
            ],
            [
                'number' => '03',
                'title' => 'Advanced Ship Design, Shipbuilding, and Modern Shipyards',
                'description' => 'Breakthrough naval architecture, carbon-neutral vessel propulsion, and the global shipyard power shift.',
                'points' => [
                    'Innovations in ship design for efficiency and safety',
                    'Pathways to carbon-neutral shipping: fuels, propulsion, and vessel design',
                    'Transforming shipyards to build modern vessels and offshore platforms',
                    'Strengthening shipyard-shipowner collaboration',
                ],
            ],
            [
                'number' => '04',
                'title' => 'Digital Transformation, Automation, and Smart Port Ecosystems',
                'description' => 'Accelerating maritime digitalization with AI, IoT telematics, digital twins, and robust cyber defense.',
                'points' => [
                    'AI, IoT, and digital twins enhancing port efficiency',
                    'Seamless integration between stakeholders, systems, and infrastructure',
                    'Data-driven navigation, predictive maintenance, and optimized routing',
                    'Strengthening cybersecurity and resilience across operations',
                ],
            ],
        ];

        // Key Panel Discussions strictly copied from marportsglobal.com/conference-topics/agenda
        $panelDiscussions = [
            [
                'number' => 1,
                'title' => 'Maritime Outlook 2030',
                'subtitle' => 'Global Challenges, Regulations, Trade & Industry Realities',
                'fullTitle' => 'Maritime Outlook 2030 – Global Challenges, Regulations, Trade & Industry Realities',
            ],
            [
                'number' => 2,
                'title' => 'Ports as Future Energy Hubs',
                'subtitle' => 'Beyond Cargo Gateways: Transforming Port Ecosystems',
                'fullTitle' => 'Ports as Future Energy Hubs – Beyond Cargo Gateways: Transforming Port Ecosystems',
            ],
            [
                'number' => 3,
                'title' => 'Geopolitics & the Changing Shipbuilding Landscape',
                'subtitle' => 'The Emerging Global Shipbuilding Power Shift',
                'fullTitle' => 'Geopolitics & the Changing Shipbuilding Landscape – The Emerging Global Shipbuilding Power Shift',
            ],
            [
                'number' => 4,
                'title' => 'Future Ports: No Depth, No Growth',
                'subtitle' => 'The Strategic Role of Dredging for Ports & Ship Owners',
                'fullTitle' => 'Future Ports: No Depth, No Growth – The Strategic Role of Dredging for Ports & Ship Owners',
            ],
            [
                'number' => 5,
                'title' => 'Maritime 4.0',
                'subtitle' => 'Balancing Digitalization, Innovation, Connectivity & Cyber Security',
                'fullTitle' => 'Maritime 4.0 – Balancing Digitalization, Innovation, Connectivity & Cyber Security',
            ],
        ];

        // Speaking Topics strictly copied from marportsglobal.com/conference-topics/agenda
        $speakingTopics = [
            'Future-proofing maritime education: adapting to emerging technologies',
            'Upskilling the maritime workforce: bridging academia and industry',
            'Funding and risk management in ports, shipping, and shipbuilding',
            'Strategic alliances in the maritime sector for competitive advantage',
        ];

        // Confirmed 2027 Speakers & Panelists
        $speakers = $this->getSpeakers();

        // Advisory Board / Panel Chairs 2027 Members
        $advisoryBoard = $this->getPanelChairs();

        // Fetch active Sponsors & Partners grouped by sort_order (same sort_order = same row)
        try {
            $dbSponsors = Sponsor::active()->ordered()->get();
        } catch (\Throwable $e) {
            $dbSponsors = collect();
        }

        if ($dbSponsors->isNotEmpty()) {
            $sponsors = $dbSponsors->groupBy('sort_order')->values()->map(function ($group) {
                return $group->values();
            })->toArray();
        } else {
            // Fallback default sponsors
            $sponsors = [
                'premier' => [
                    ['name' => 'AS Gold Sponsor', 'role' => 'Premier Sponsor', 'tag' => 'AS', 'logo' => '/new/images/sponsors/sponsor_1788931598_whatsapp-image-2026-09-09-at-102744.jpeg', 'website_url' => 'https://india.globalpsa.com/'],
                ],
                'registration' => [
                    ['name' => 'Mazagon Dock Shipbuilders Limited', 'role' => 'Registration Area Sponsor', 'tag' => 'MDSL', 'logo' => '/new/images/sponsors/mazagon-dock-logo.jpg', 'website_url' => 'https://mazagondock.in/'],
                ],
                'lunch_coffee' => [
                    ['name' => 'ABS Marine Services Ltd', 'role' => 'Lunch & Coffee Sponsor', 'tag' => 'ABS', 'logo' => '/new/images/sponsors/abs-marine-services-logo.jpg', 'website_url' => 'https://absmarine.com/'],
                    ['name' => 'GRSE (Garden Reach Shipbuilders & Engineers)', 'role' => 'Lunch & Coffee Sponsor', 'tag' => 'GRSE', 'logo' => '/new/images/sponsors/grse-logo.jpg', 'website_url' => 'https://grse.in/'],
                ],
                'table_top' => [
                    ['name' => 'Nirmon Marine & Offshore Design Pvt Ltd', 'role' => 'Table Top Sponsor', 'tag' => 'NIRMON', 'logo' => '/new/images/sponsors/nirmon-marine-logo.jpg', 'website_url' => 'https://www.nirmondesign.com/'],
                ],
                'associate' => [
                    ['name' => 'KNK Ship Management', 'role' => 'Associate Sponsor', 'tag' => 'KNK', 'logo' => '/new/images/sponsors/knk-ship-management-logo.jpg', 'website_url' => 'https://knkshipping.co.in/'],
                    ['name' => 'Core Axis Maritime Solutions L.L.C', 'role' => 'Associate Sponsor', 'tag' => 'CORE AXIS', 'logo' => '/new/images/sponsors/core-axis-maritime-logo.jpg', 'website_url' => 'https://coreaxismaritime.com/'],
                ],
                'promoting' => [
                    ['name' => 'Port of Rotterdam', 'role' => 'Promoting Organisation', 'tag' => 'ROTTERDAM', 'logo' => '/new/images/sponsors/port-of-rotterdam-logo.png', 'website_url' => 'https://www.portofrotterdam.com/en'],
                    ['name' => 'Institute of Chartered Shipbrokers (Madras Branch)', 'role' => 'Promoting Organisation', 'tag' => 'ICS Madras', 'logo' => '/new/images/sponsors/ics-madras-logo.jpg', 'website_url' => 'https://www.ics.org.uk/'],
                    ['name' => 'INSA (Indian National Shipowners\' Association - ESTD. 1929)', 'role' => 'Promoting Organisation', 'tag' => 'INSA', 'logo' => '/new/images/sponsors/insa-logo.jpg', 'website_url' => 'https://www.insa.org.in/'],
                    ['name' => 'SAI (Shipyards Association of India)', 'role' => 'Promoting Organisation', 'tag' => 'SAI', 'logo' => '/new/images/sponsors/sai-logo.jpg', 'website_url' => 'https://www.shipyardsassociationofindia.com/'],
                    ['name' => 'ASA (Asian Shipowners\' Association)', 'role' => 'Promoting Organisation', 'tag' => 'ASA', 'logo' => '/new/images/sponsors/asa-logo.png', 'website_url' => 'https://asianshipowners.org/'],
                    ['name' => 'Institution of Naval Architects', 'role' => 'Promoting Organisation', 'tag' => 'INA', 'logo' => '/new/images/sponsors/ina-logo.jpg', 'website_url' => 'https://inaindia.co.in/'],
                ],
            ];
        }

        // Participating Organizations
        $participatingOrganizations = [
            'Mazagon Dock Shipbuilders Limited',
            'Garden Reach Shipbuilders & Engineers (GRSE)',
            'Port of Rotterdam Authority',
            'Larsen & Toubro (L&T Heavy Civil Infrastructure)',
            'DNV Maritime Advisory',
            'The Great Eastern Shipping Co Ltd',
            'Maritime NXT',
            'ABS Marine Services Ltd',
            'KNK Ship Management',
            'Core Axis Maritime Solutions',
            'Nirmon Marine & Offshore Design',
            'IIT Madras (Dept of Ocean Engineering)',
            'Ashoka University',
            'Energy Exemplar Singapore',
            'Institute of Chartered Shipbrokers',
            'INSA (Indian National Shipowners\' Association)',
        ];

        // 30 Official Award Categories from marportsglobal.com
        // Official MARPORTS GLOBAL 2027 Awards Categories from Brochure
        $awardCategories = [
            ['id' => 1, 'title' => 'Excellence in Port Strategy'],
            ['id' => 2, 'title' => 'Excellence in Public Sector Leadership'],
            ['id' => 3, 'title' => 'Excellence in Maritime Policy Affairs'],
            ['id' => 4, 'title' => 'Inspiring Women Leader – Maritime'],
            ['id' => 5, 'title' => 'Excellence in Business Development & Special Projects'],
            ['id' => 6, 'title' => 'Young Personality of the Year – Maritime'],
            ['id' => 7, 'title' => 'Best Maritime University'],
            ['id' => 8, 'title' => 'Best Performing Port Authority of the Year'],
            ['id' => 9, 'title' => 'Emerging Port of the Year'],
            ['id' => 10, 'title' => 'Shipowner of the Year'],
            ['id' => 11, 'title' => 'Port Developer of the Year'],
            ['id' => 12, 'title' => 'Ship Management Company of the Year'],
            ['id' => 13, 'title' => 'Ship Agency of the Year'],
            ['id' => 14, 'title' => 'Shipping Line of the Year'],
            ['id' => 15, 'title' => 'Emerging Maritime AI Start-up'],
            ['id' => 16, 'title' => 'Excellence in Maritime Digital Media'],
            ['id' => 17, 'title' => 'Excellence in Legal Maritime Affairs'],
            ['id' => 18, 'title' => 'Excellence in Green Shipping Initiatives'],
            ['id' => 19, 'title' => 'Leading Regional Maritime Association'],
            ['id' => 20, 'title' => 'Excellence in Global Cruise Ship Management'],
            ['id' => 21, 'title' => 'Global Container Terminal Operator'],
            ['id' => 22, 'title' => 'Global Leader in Dredging'],
            ['id' => 23, 'title' => 'Excellence in Ship Classification & Certification Services'],
            ['id' => 24, 'title' => 'Icon – Global Maritime Industry'],
            ['id' => 25, 'title' => 'Lifetime Achievement Award – Management'],
            ['id' => 26, 'title' => 'Lifetime Achievement Award – Technical Excellence'],
            ['id' => 27, 'title' => 'Lifetime Achievement Award – Maritime Services'],
            ['id' => 28, 'title' => 'Lifetime Achievement Award – Entrepreneurship'],
        ];

        // Past Edition Highlights (MARPORTS GLOBAL 2026)
        $pastEdition2026 = [
            'edition' => 'MARPORTS GLOBAL 2026',
            'date' => '24th April 2026',
            'venue' => 'Lemon Tree Hotel, Trivandrum, India',
            'summary' => 'A benchmark gathering uniting industry icons, Indian government dignitaries, and international maritime pioneers.',
            'notable_guests' => [
                'Shri Shyam Jagannathan I.A.S – Director General of Shipping, Ministry of Ports, Shipping and Waterways',
                'Dr. Jayakumar – Honorary Chairman, Advisory Board',
                'Dr. Ravi Kumar Mehrotra CBE – Foresight Group',
                'Capt. (Dr.) Sankalp Shukla – Chairman, FOSMA / Bernhard Schulte Shipmanagement',
                'Rajesh Menon – DPIIT, Ministry of Commerce & Industry',
                'Datuk Puvanesan Subenthiran – Maritime Veteran',
            ],
        ];

        $allPublishedPages = CmsPage::where('status', 'published')->get();
        $contentOverrides = [];
        foreach ($allPublishedPages as $p) {
            if (! empty($p->content_blocks) && is_array($p->content_blocks)) {
                $contentOverrides = array_merge($contentOverrides, $p->content_blocks);
            }
        }
        $menuLabels = $allPublishedPages->pluck('menu_label', 'slug')->toArray();

        return Inertia::render('Home', [
            'eventDetails' => $eventDetails,
            'conferenceTopics' => $conferenceTopics,
            'panelDiscussions' => $panelDiscussions,
            'speakingTopics' => $speakingTopics,
            'speakers' => $speakers,
            'advisoryBoard' => $advisoryBoard,
            'sponsors' => $sponsors,
            'participatingOrganizations' => $participatingOrganizations,
            'awardCategories' => $awardCategories,
            'pastEdition2026' => $pastEdition2026,
            'contentOverrides' => $contentOverrides,
            'menuLabels' => $menuLabels,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'organization' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'pass_tier' => 'required|string',
            'type' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $registration = Registration::create([
            'type' => $validated['type'] ?? 'delegate',
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'organization' => $validated['organization'],
            'designation' => $validated['designation'] ?? null,
            'industry' => $validated['industry'] ?? null,
            'pass_tier' => $validated['pass_tier'],
            'message' => $validated['message'] ?? null,
            'status' => 'confirmed',
        ]);

        return back()->with('success', 'Thank you! Your submission for MARPORTS GLOBAL 2027 has been recorded (Ref #'.str_pad($registration->id, 5, '0', STR_PAD_LEFT).'). Our team from E Hub Events will contact you shortly.');
    }

    /**
     * Confirmed Speakers & Panelists extracted from official marportsglobal.com/conference-topics/speakers
     *
     * @return array<int, array<string, mixed>>
     */
    public function getSpeakers(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Biju George',
                'designation' => 'Director (Operations)',
                'company' => 'Mazagon Dock Shipbuilders Ltd',
                'role' => 'Panelist',
                'image' => '/images/speakers/biju-george.jpeg',
                'linkedin' => 'https://www.linkedin.com/company/mazagon-dock-shipbuilders-limited/',
                'bio' => "Shri. Biju George was appointed as the Director (Operations) of Mazagon Dock Shipbuilders Limited on 27.10.2021. Apart from construction of Naval ships, he is also heading Refits of Naval and Coast Guard ships, Export, R&D innovation and AI projects.\n\nHe graduated in Engineering from NSS College of Engineering, Palakkad and later on completed his post graduate degree in Ocean Engineering and Naval Architecture from the Indian Institute of Technology, Kharagpur.\n\nPrior to his appointment as Director (Operations), he was the project Superintendent of the prestigious P17A Frigate Program for the Indian Navy. Prior to this, he was heading the Shipbuilding Design Department of MDL and has more than three decades of experience in Design and Construction of frontline warships viz. Missile Destroyers and Stealth Frigates. He is currently spearheading Major Infrastructure development projects for MDL including development of a Green Field Shipyard at MDL's Nhava Yard. Under his guidance and leadership MDL has delivered four Destroyer class vessels ahead of their schedule, delivered three stealth frigates for the Indian Navy.",
            ],
            [
                'id' => 2,
                'name' => 'Nikita Singla',
                'designation' => 'Visiting Fellow',
                'company' => 'Isaac Centre for Public Policy, Ashoka University',
                'role' => 'Moderator',
                'image' => '/images/speakers/nikita-singla.jpeg',
                'linkedin' => 'https://www.linkedin.com/in/nikita-singla-02779018/',
                'bio' => "Nikita Singla is a trade facilitation specialist with experience across more than fifty ports in South Asia. She is a Visiting Fellow at the Isaac Centre for Public Policy, Ashoka University, a Non-Resident Scholar at Carnegie Endowment for International Peace, and Program Manager with IOS Partners on the U.S. Department of State's Ports of the Future Program.\n\nShe is 2026 Maitri Fellow with the Centre for Australia-India Relations, hosted by the University of Western Australia. She has been a Consultant with the World Bank and was 2024 Quad Infrastructure Fellow with the U.S. Department of State, focusing on secure and sustainable infrastructure at ports. She is an engineer from Indian Institute of Technology (IIT) Delhi and Masters in International Economic Policy from Sciences Po Paris.",
            ],
            [
                'id' => 3,
                'name' => 'Punit Oza FICS',
                'designation' => 'Founder & Director',
                'company' => 'Maritime NXT',
                'role' => 'Panelist',
                'image' => '/images/speakers/punit-oza.jpeg',
                'linkedin' => 'https://www.linkedin.com/in/punit-oza-fics-afni-llb-m-sc-6149893/',
                'bio' => "Punit Oza is the founder & Director of Maritime NXT, Singapore, which is focussed on driving the \"Next\" in Maritime through training, teaching, mentoring, consulting & collaborating in commercial shipping & digital transformation space. He is a Senior Adjunct Fellow at Maritime & Port Authority of Singapore (MPA) Academy, an Affiliated Research Fellow at Singapore Management University and a guest lecturer at multiple business schools in China, Singapore, India, Greece, UK & Denmark lecturing on \"Geopolitical Risks & their impact on Supply Chain and Trade Flows\". Punit hosts a monthly podcast on the Geopolitics & Trade with Seatrade Maritime Podcast, interviewing prominent shipping, trade & technology leaders.\n\nPunit is also the current President & Fellow of the Institute of Chartered Shipbrokers, UK and sits on the board of Netbulk, Singapore as a Non-Executive Director. Punit started his career in Dry Bulk Shipping over 30 years ago and has held senior management positions in some leading shipping companies including Precious Shipping, Noble Group & Torvald Klaveness, holding senior commercial positions in the group as well as head of Digital Transformation at Klaveness Dry Bulk.\n\nPunit previously served as the Executive Director of Singapore Chamber of Maritime Arbitration, driving transformation & positive changes, combining legal & commercial expertise. Prior to that, Punit was on the board of Singapore Maritime Foundation. Mr. Punit Oza is currently the Chief Commercial Officer of FrontM, which is pioneering a holistic digital toolbox bridging the ship-shore divide and optimizing maritime operations. Punit is deeply involved with the maritime tech-startup space and is also an angel investor and advisor in Motion Ventures, a VC fund focused on Sustainable Maritime and Supply Chain startups. Punit holds a Masters in Shipping, Trade and Finance from Bayes (previously CASS) Business School, UK and a LLB and Post Graduate Diploma in Maritime Law from University of London.",
            ],
            [
                'id' => 4,
                'name' => 'Mudit Mehrotra',
                'designation' => 'Head - Regulatory Cell',
                'company' => 'The Great Eastern Shipping Co Ltd',
                'role' => 'Panelist',
                'image' => '/images/speakers/mudit-mehrotra.png',
                'linkedin' => 'https://www.linkedin.com/company/the-great-eastern-shipping-co.-ltd/',
                'bio' => "Mudit Mehrotra completed 4 years Marine Engg from DMET, Calcutta, India in 1988 and Completed Executive MBA with ITM.\n\nJoined The Great Eastern Shipping Company in Apr 1989 and sailed on variety of vessels – Sailed upto rank of Chief Engineer in GESCO.\n\nJoined Great Eastern Shipping shore office as Senior Manager Technical Tanker Dept. in March 1998. Presently working as Asst Vice President in the Regulatory Compliance in The Great Eastern Shipping Company Limited. Have been part of Dept handling fleet of different type of ships and have been actively involved in New Building incl contract, design and thereafter supervision.\n\nAdditionally, have been part of Indian Govt delegation for International Maritime Organization in London in various committees such as MEPC, MSC, LP, SDC, etc and member BIMCO Marine Environmental Committee. Active member of INSA technical committee in addition to representation in Technical committee of Class societies such as IRS, DNV, ABS, BV, etc in India and in Asia Pacific region.",
            ],
            [
                'id' => 5,
                'name' => 'Dr. Kuntal Satpathi',
                'designation' => 'Team Lead (Solutions)',
                'company' => 'Energy Exemplar Singapore',
                'role' => 'Panelist',
                'image' => '/images/speakers/kuntal-satpathi.jpg',
                'linkedin' => 'https://www.linkedin.com/company/energy-exemplar/',
                'bio' => "Dr. Kuntal Satpathi is an energy markets and power systems specialist with deep experience delivering modelling, advisory, and implementation projects across Asia‑Pacific. He focuses on energy systems modelling, client advisory, and the design and delivery of PLEXOS‑based analytical frameworks and training programs.\n\nIn recent years, he has leveraged PLEXOS to conduct decarbonization studies in the marine sector and has contributed to the development of a green shipping corridor evaluation framework. Earlier in his career, he was involved in a major power generation project in India and has developed strong expertise in the operation, control, and protection of emerging power networks.",
            ],
            [
                'id' => 6,
                'name' => 'Antony Prince',
                'designation' => 'President & CEO',
                'company' => 'Smart Engineering & Design Solutions Ltd.',
                'role' => 'Panelist',
                'image' => '/images/speakers/antony-prince.jpg',
                'linkedin' => 'https://www.linkedin.com/in/antony-prince-a0353b73/',
                'bio' => "Mr. Antony Prince is an internationally acclaimed maritime leader, naval architect, and marine engineering consultant whose distinguished career spans more than five decades across Japan, India, China, Korea, Singapore, Europe, Canada, and the Bahamas. Widely respected for his visionary leadership in ship design, engineering innovation, and maritime consultancy, he has played a transformative role in strengthening global shipbuilding practices while advancing India's emergence as a centre for indigenous maritime design and engineering excellence.\n\nCurrently serving as President & CEO of Smart Engineering & Design Solutions Ltd. (SEDS), Kochi, India, Mr. Prince is also President of GTR Campbell Marine Consultants Ltd. and Algoship Designers Ltd., Nassau, Bahamas. Through his leadership, these organisations have become globally recognised for delivering technically sophisticated, commercially viable, and internationally benchmarked ship design solutions for both commercial and defence sectors.\n\nA firm believer in Mahatma Gandhi's philosophy, \"You must be the change you want to see in the world,\" Mr. Prince has consistently demonstrated how vision, discipline, and integrity can reshape industries and empower future generations. His professional journey reflects a lifelong commitment to technological excellence, workforce development, and sustainable maritime innovation.\n\nA native of Kochi, Kerala, Mr. Antony Prince graduated in Mechanical Engineering from TKM College of Engineering in 1968. Inspired by India's post-independence industrial aspirations and guided by an unwavering determination to contribute to nation-building, he began his professional journey in the maritime sector at a time when industrial opportunities in India remained limited.\n\nIn 1972, Mr. Prince joined GTR Campbell in Japan under the mentorship of the legendary naval architect George T.R. Campbell, a pioneering force behind Japan's post-war shipbuilding transformation. Over nearly 17 years in Japan, he acquired extensive expertise in advanced shipbuilding methodologies, precision engineering, structured production systems, and modern naval architecture.\n\nMr. Prince's exceptional technical capability and strategic vision earned him progressive leadership responsibilities within GTR Campbell, culminating in his appointment as President of GTR Campbell International Ltd., Nassau, Bahamas, in 1989. Significantly, he became the first and only Indian—and among the few Asians—to lead this internationally respected maritime organisation. Under his stewardship, GTR Campbell Marine Consultants has played a vital role in the successful design and construction of more than 150 vessels worldwide, serving shipowners, shipyards, and maritime stakeholders across multiple continents. Several vessels developed under his leadership have received international recognition, including being honoured among the \"Significant Ships of the Year\" by the Royal Institution of Naval Architects (RINA), United Kingdom.\n\nOne of Mr. Prince's landmark achievements came in the 1990s with the development of the innovative \"Fantasy – Ship of the Future\" concept, redefining the 20,000–30,000 DWT handy-size bulk carrier segment through enhanced efficiency, optimised production methodologies, and standardised high-performance design principles.\n\nIn 2003, he facilitated the placement of six export bulk carrier orders at Cochin Shipyard Limited and four export vessel orders at Hindustan Shipyard Limited, Visakhapatnam, marking a major milestone in India's emergence as a competitive global shipbuilding nation.\n\nDriven by a vision to establish strong indigenous maritime design capability, Mr. Prince founded Smart Engineering & Design Solutions Ltd. (SEDS) in 2007 in Kochi, India. Today, SEDS delivers comprehensive engineering and consultancy services across commercial, defence, and specialised vessel categories. Through SEDS, he has mentored and trained more than 500 engineers, championing the vision of \"Design in India; Make in India\".",
            ],
        ];
    }

    /**
     * Dedicated Speakers & Panelists Page
     */
    public function speakers()
    {
        $allPublishedPages = CmsPage::where('status', 'published')->get();
        $menuLabels = $allPublishedPages->pluck('menu_label', 'slug')->toArray();

        return Inertia::render('Speakers', [
            'speakers' => $this->getSpeakers(),
            'menuLabels' => $menuLabels,
        ]);
    }

    /**
     * Standalone Executive Bio Print/PDF view
     */
    public function speakerBio(int $id)
    {
        $speakers = $this->getSpeakers();
        $speaker = collect($speakers)->firstWhere('id', $id);

        if (! $speaker) {
            abort(404, 'Speaker Bio Not Found');
        }

        return view('speaker-bio', [
            'speaker' => $speaker,
        ]);
    }

    /**
     * Panel Chairs 2027 Members
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPanelChairs(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Cmde PR Hari, IN (Retd.)',
                'designation' => 'Chairman & Managing Director',
                'company' => 'Garden Reach Shipbuilders & Engineers Ltd (GRSE), Kolkata',
                'role' => 'Panel Chair',
                'initials' => 'PRH',
                'image' => '/images/advisory/CMDE_PR_HARI.jpeg',
                'bio' => "Cmde PR Hari, IN (Retd.) is a Mechanical Engineer with Master's Degree in Defence & Strategic Studies. He has undergone Defence Services Staff Course at DSSC (Wellington), Higher Defence Orientation Course at Army War College (Mhow) and the prestigious Naval Higher Command Course at Naval War College (Goa).\n\nHe has had an illustrious career spanning over 37 years including 28 years in the Indian Navy, during which he has held various prestigious appointments in key positions of strategy, operations, technical administration and decision making. He has served in nine ships of the Indian Navy, including seven frontline warships. His other notable appointments include field assignments in Naval Repair Organisations, Staff appointments at Eastern Naval Command & as the Command Engineer Officer of Southern Naval Command and also the prestigious appointment as Warship Production Superintendent at Kochi, steering the Indigenous Aircraft Carrier project.\n\nCmde PR Hari, IN (Retd.) joined GRSE as Chief General Manager (Production Planning & Control) in the year 2016 and was in charge of production planning of all new construction ships at that point of time. He became Director (Personnel) of the Company on 21 Oct 2019 and then went on to assume charge as Chairman & Managing Director on 10 Jun 2022.\n\nThe Chairman & Managing Director has defined an ambitious Vision for the company and strives to make GRSE the best Indian Shipyard to be recognised globally. With him at the helm of affairs, the company has seen a stellar growth with strong financial performance. GRSE's turnover grew to INR 7002 Crores in FY26 from INR 1754 Crores in FY22 within four years, with the market capitalisation of the Company rising to INR 22576 Crores in FY26 from INR 2593 Crores in FY22. Other noteworthy achievements were recategorisation of the Shipyard as a Schedule 'A' CPSE in 2024 and attaining Navratna status in 2026.\n\nThe Chairman & Managing Director envisions to further strengthen government's 'Make in India' initiative, create a unique identity for the company amongst its peers as a fully diversified entity with products ranging from \"Warships to Weapons\". Towards this, his thrust has been on improving productivity, new technology adaptation with specific focus on development of 'Green' & 'Autonomous' platforms, enhancing efficiency, devising new policies, increasing the vendor base, human resource development and most importantly instill a sense of discipline amongst employees of the shipyard.\n\nThe Chairman & Managing Director is recipient of multiple awards in the year 2025 including 'PSU Samarpan Award', CMA's 'Management Excellence Award', ICC PSE Excellence Award for 'CEO/CMD/MD of the Year' & Governance Now PSU Awards for 'CMD/MD of the Year'. He has also been conferred with 'Lifetime Achievement Award' at Marports Global Conference in April 2026. He is currently the Chair of Defence & Aerospace Committee, Indian Chamber of Commerce (ICC) and President, Indian Shipbuilders Association (ISBA).",
            ],
            [
                'id' => 2,
                'name' => 'Biju George',
                'designation' => 'Director (Operations)',
                'company' => 'Mazagon Dock Shipbuilders Ltd',
                'role' => 'Panel Chair',
                'initials' => 'BG',
                'image' => '/images/advisory/BIJU_GEORGE.jpeg',
                'bio' => "Shri. Biju George was appointed as the Director (Operations) of Mazagon Dock Shipbuilders Limited on 27.10.2021. Apart from construction of Naval ships, he is also heading Refits of Naval and Coast Guard ships, Export, R&D innovation and AI projects.\n\nHe graduated in Engineering from NSS College of Engineering, Palakkad and later on completed his post graduate degree in Ocean Engineering and Naval Architecture from the Indian Institute of Technology, Kharagpur.\n\nPrior to his appointment as Director (Operations), he was the project Superintendent of the prestigious P17A Frigate Program for the Indian Navy. Prior to this, he was heading the Shipbuilding Design Department of MDL and has more than three decades of experience in Design and Construction of frontline warships viz. Missile Destroyers and Stealth Frigates. He is currently spearheading Major Infrastructure development projects for MDL including development of a Green Field Shipyard at MDL's Nhava Yard. Under his guidance and leadership MDL has delivered four Destroyer class vessels ahead of their schedule, delivered three stealth frigates for the Indian Navy.",
            ],
            [
                'id' => 3,
                'name' => 'Tijo C. Mathew',
                'designation' => 'GM & Head – Ports & Harbours Business Segment',
                'company' => 'Heavy Civil Infrastructure, Larsen & Toubro Limited',
                'role' => 'Panel Chair',
                'initials' => 'TCM',
                'image' => '/images/advisory/TIJO_C_MATHEW.jpeg',
                'bio' => "Mr. Tijo C. Mathew is a seasoned civil engineering and infrastructure leader with over 23 years of extensive experience in marine, ports, and large-scale infrastructure development. Currently serving as General Manager & Head of the Ports & Harbours Business Segment at Larsen & Toubro Construction, he leads strategic direction, operations, and execution of complex maritime infrastructure projects.\n\nAn alumnus of Indian Institute of Technology Madras and SP Jain Institute of Management and Research, Mr. Mathew holds an M.Tech in Construction Technology & Management and a Post Graduate Diploma in Executive Management. He is also a Chartered Engineer affiliated with the Institution of Civil Engineers, UK and the Engineering Council, UK.\n\nHe began his career with L&T in 2003, contributing to critical marine infrastructure projects including breakwaters, dredging, and LNG terminals. Between 2013 and 2016, he played a key role in the prestigious Riyadh Metro Project in Saudi Arabia, overseeing design and construction engineering for a 26 km elevated metro viaduct.\n\nUpon returning to India, he led engineering design and coordination for specialized bridge and marine projects, and subsequently headed the Ports & Harbours Design & Research Centre. From 2017 onwards, he has been instrumental in delivering engineering excellence, value optimization, and tendering for multiple large-scale marine projects.\n\nSince 2022, Mr. Mathew has transitioned into business leadership, successfully steering the Ports & Harbours segment with a focus on innovation, operational excellence, and project delivery. Under his leadership, major infrastructure projects have been executed for leading clients including the Indian Navy, Cochin Shipyard, Petronet LNG, DP World, and APM Terminals. With a strong blend of technical expertise and strategic vision, Mr. Tijo C. Mathew continues to be a driving force in advancing port and maritime infrastructure development in India and beyond.",
            ],
            [
                'id' => 4,
                'name' => 'Ajay Kumar Singh',
                'designation' => 'Head of Section, Maritime Advisory India',
                'company' => 'DNV',
                'role' => 'Panel Chair',
                'initials' => 'AKS',
                'image' => '/images/advisory/AJAY_KUMAR_SINGH.jpeg',
                'bio' => "Ajay is a maritime consultant with around 10 years of experience. He holds a Master's degree in Rotating Equipment, an MBA in Health Safety and Environmental Management, and a Bachelor's in Mechanical Engineering. He leads and manages a diverse team of consultants and senior consultants at DNV Maritime Advisory India, delivering high-quality services to clients in the maritime and port sectors.\n\nHis expertise spans alternative fuel technologies for ships, techno-commercial studies for maritime decarbonization, and project management activities. Ajay has performed gap assessments for LNG and methanol bunkering terminal facilities in India, and managed health & safety assessments for ports in Asia and the Middle East. His project management skills cover maritime decarbonization, noise and vibration studies, safety risk and reliability, life cycle management, and shipping advisory in the maritime and port sector.",
            ],
            [
                'id' => 5,
                'name' => 'Mathew Johns',
                'designation' => 'Managing Director',
                'company' => 'Core Axis Maritime Solutions L.L.C',
                'role' => 'Panel Chair',
                'initials' => 'MJ',
                'image' => '/images/advisory/MATHEW_JOHNS.jpeg',
                'bio' => "Dynamic and results-driven Sales & Business Development Leader with 17+ years of expertise in the Maritime and Oil & Gas Sectors. Specialized in Shipbuilding & Ship Repair Operations, Conversions & Retrofit Special Projects with proven track record of driving revenue growth, securing multimillion-dollar contracts, and building strong cross-cultural client relationships across the Asia and Middle East region.\n\nFounder & Managing Director of CoreAxis Maritime Solutions LLC (2026 onwards), a forward-thinking maritime consultancy and solutions provider delivering high-impact services across the Maritime and Oil & Gas sectors.\n\nFormerly Head of Business Development & Sales at Premier Marine Engineering LLC (Feb 2019 - March 2026), where he spearheaded revenue growth from 35 Million to 360+ Million turnover in 5 years with major conversion projects and fleet contracts. Previously Regional Sales Manager at Goltens Dubai, Marketing Manager at AHI Keppel Shipyard, and Business Development Manager at Al Jazeera Shipyard (RAK Ports).\n\nEducation: Post Graduate in International Business Administration from Newcastle Business School (Northumbria University, UK) and Bachelor's Degree in Science (BSc Chemistry) from Mahatma Gandhi University, India.",
            ],
            [
                'id' => 6,
                'name' => 'Amlan Bora',
                'designation' => 'Chief Representative for South Asia',
                'company' => 'Port of Rotterdam Authority',
                'role' => 'Panel Chair',
                'initials' => 'AB',
                'image' => '/images/advisory/AMLAN_BORA.jpg',
                'bio' => "Amlan Bora is the Chief Representative of the Port of Rotterdam for India and South Asia. Mr. Bora's primary task is to facilitate Port of Rotterdam establish stronger and meaningful partnerships and equitable supply chains for containerized cargo and bulk as well as new green energy molecules, such as ammonia and hydrogen. It also applies to the Port Authority's and the Ministry of Foreign Affairs' of the Dutch government's efforts to explore business synergies around critical raw materials between Europe and South Asia.\n\nPrior to this assignment, Mr Bora in the capacity of Chief Representative cum Trade & Investment Commissioner led the trade offices network of the Ministry of Economic Affairs of the Government of The Netherlands in India on top of over 20 years' professional experience working for major multinational companies like Siemens, Philips and Diageo based out of their global HQs in Munich, Amsterdam, and London respectively.",
            ],
            [
                'id' => 7,
                'name' => 'Niranjan Nigalye',
                'designation' => 'CEO & Founder',
                'company' => 'Nirmon Marine & Offshore Design Pvt Ltd',
                'role' => 'Panel Chair',
                'initials' => 'NN',
                'image' => '/images/advisory/NIRANJAN_NIGALYE.jpg',
                'bio' => "Niranjan Nigalye is the CEO & Founder of Nirmon Marine & Offshore Design, one of India's leading and fastest-growing ship design and marine engineering companies. He is a graduate in Naval Architecture and Ocean Engineering from the Indian Maritime University.\n\nBefore founding Nirmon, he worked with the Indian Register of Shipping (IRS), gaining valuable experience in ship classification and marine engineering. Under his leadership, Nirmon has grown into a team of over 100 design engineers, delivering engineering solutions for newbuild vessels, ship conversions, retrofits, offshore structures, and marine projects. Today, Nirmon partners with leading shipyards and maritime organizations across India, Finland, the USA, the Middle East, and Asia, providing world-class ship design and engineering services to the global maritime industry.",
            ],
            [
                'id' => 8,
                'name' => 'Dr. S. A. Sannasiraj',
                'designation' => 'Chair Professor, Department of Ocean Engineering',
                'company' => 'Indian Institute of Technology Madras (IIT Madras)',
                'role' => 'Panel Chair',
                'initials' => 'SAS',
                'image' => '/images/advisory/DR.S.A.SANNASIRAJ.jpg',
                'bio' => 'Dr. S. A. SANNASIRAJ is the Chair Professor of the Department of Ocean Engineering, IIT Madras. He coordinates the Centre of Excellence on Climate Change Impacts on coastal infrastructures & its adaptation strategies and National Technological Centre for Ports, Waterways and Coasts. He is the lead Asian coordinator of DAAD sponsored Global water and climate adaptation centre (ABCD Centre) in India and the vice-chair of executive council of Asia Pacific Division of IAHR. His area of specialization includes numerical wave modelling, structural rehabilitation, port and harbour structures, and coastal protection. He has more than 150 journal publications; 4 patents; co-authored 4 text books on coasts; successfully completed 12 major research projects & 300 industrial projects; and organized more than 25 workshops.',
            ],
        ];
    }

    /**
     * Standalone Panel Chair Bio Print/PDF view
     */
    public function panelChairBio(int $id)
    {
        $chairs = $this->getPanelChairs();
        $member = collect($chairs)->firstWhere('id', $id);

        if (! $member) {
            abort(404, 'Panel Chair Bio Not Found');
        }

        return view('speaker-bio', [
            'speaker' => $member,
        ]);
    }
}
