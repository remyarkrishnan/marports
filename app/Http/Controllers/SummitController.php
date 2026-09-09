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

        // 4 Core Conference Topics from marportsglobal.com
        $conferenceTopics = [
            [
                'number' => '01',
                'title' => 'Sustainable, Green, and Resilient Shipping',
                'description' => 'Navigating regulatory challenges, decarbonization roadmaps, and the future of resilient ocean supply chains.',
                'points' => [
                    'Global shipping outlook and trade perspectives from leading shipowners',
                    'Advancing green and sustainable shipping strategies to meet IMO decarbonization targets',
                    'Fleet optimization: dynamic routing, alternative fuels, and predictive maintenance',
                    'Shipowner-port partnerships driving operational and environmental excellence',
                ],
            ],
            [
                'number' => '02',
                'title' => 'Port Infrastructure and Strategic Initiatives',
                'description' => 'Future-proofing port assets, climate resilience, and establishing integrated maritime energy hubs.',
                'points' => [
                    'Innovative port design, capacity expansion, and deep-draft infrastructure safety',
                    'Climate resilience and future-proofing critical coastal infrastructure',
                    'Collaborative port-led industrial development and hinterland multimodal connectivity',
                    'Port-based renewable energy hubs, bunkering corridors, and green hydrogen adoption',
                ],
            ],
            [
                'number' => '03',
                'title' => 'Advanced Ship Design, Shipbuilding, and Modern Shipyards',
                'description' => 'Breakthrough naval architecture, carbon-neutral vessel propulsion, and the global shipyard power shift.',
                'points' => [
                    'Next-generation hull design and hydrodynamics for energy efficiency and voyage safety',
                    'Pathways to carbon-neutral shipping: methanol, ammonia, electric, and hybrid propulsion',
                    'Modernizing shipyards to construct next-gen vessels and specialized offshore platforms',
                    'Fostering strong domestic and international shipyard-shipowner commercial collaborations',
                ],
            ],
            [
                'number' => '04',
                'title' => 'Digital Transformation, Automation, and Smart Port Ecosystems',
                'description' => 'Accelerating maritime digitalization with AI, IoT telematics, digital twins, and robust cyber defense.',
                'points' => [
                    'Deploying AI, IoT sensors, and port digital twins to maximize berth and terminal throughput',
                    'Seamless digital integration between terminal operators, customs authorities, and logistics carriers',
                    'Predictive voyage logistics utilizing big data, ocean telematics, and machine learning',
                    'Cybersecurity defense strategies for critical vessel OT networks and port management systems',
                ],
            ],
        ];

        // Key Panel Discussions
        $panelDiscussions = [
            [
                'title' => 'Maritime Outlook 2030',
                'subtitle' => 'Global Challenges, Regulations, Trade & Industry Realities',
                'desc' => 'An executive examination of evolving global trade lanes, carbon compliance taxation, geopolitical bottlenecks, and fleet replacement cycles facing shipowners worldwide.',
            ],
            [
                'title' => 'Ports as Future Energy Hubs',
                'subtitle' => 'Beyond Cargo Gateways: Transforming Port Ecosystems',
                'desc' => 'How leading ports are evolving from traditional cargo interchanges into clean energy centers supplying green methanol, hydrogen bunkering, and shore-to-ship cold ironing power grids.',
            ],
            [
                'title' => 'Geopolitics & the Changing Shipbuilding Landscape',
                'subtitle' => 'Emerging Global Shipbuilding Power Shift',
                'desc' => 'Analyzing capacity expansions, national shipbuilding policies, subsidies, and strategic partnerships shifting the global shipbuilding and ship repair hierarchy.',
            ],
            [
                'title' => 'Future Ports: No Depth, No Growth',
                'subtitle' => 'Strategic Role of Dredging for Ports & Ship Owners',
                'desc' => 'Examining capital and maintenance dredging strategies, mega-container vessel drafts, environmental permits, and financing deep-draft maritime gateways.',
            ],
            [
                'title' => 'Maritime 4.0',
                'subtitle' => 'Balancing Digitalization, Innovation, Connectivity & Cyber Security',
                'desc' => 'Operational technology (OT) cybersecurity, satellite AIS data integrity, port automation robotics, and digital customs transformation.',
            ],
        ];

        // Confirmed 2027 Speakers & Panelists
        $speakers = [
            [
                'id' => 1,
                'name' => 'Biju George',
                'designation' => 'Director (Operations)',
                'company' => 'Mazagon Dock Shipbuilders Ltd',
                'role' => 'Panelist',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                'bio' => 'Distinguished maritime executive spearheading operations at Mazagon Dock Shipbuilders Limited, driving defense and commercial vessel fabrication.',
            ],
            [
                'id' => 2,
                'name' => 'Nikita Singla',
                'designation' => 'Visiting Fellow',
                'company' => 'Isaac Centre for Public Policy, Ashoka University',
                'role' => 'Moderator',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                'bio' => 'Accomplished policy researcher specializing in regional trade connectivity, port logistics integration, and cross-border maritime policy.',
            ],
            [
                'id' => 3,
                'name' => 'Punit Oza FICS',
                'designation' => 'Founder & Director',
                'company' => 'Maritime NXT',
                'role' => 'Panelist',
                'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
                'bio' => 'Global dry bulk and maritime digital strategist, Fellow of the Institute of Chartered Shipbrokers, and thought leader in supply chain decarbonization.',
            ],
            [
                'id' => 4,
                'name' => 'Mudit Mehrotra',
                'designation' => 'Head - Regulatory Cell',
                'company' => 'The Great Eastern Shipping Co Ltd',
                'role' => 'Panelist',
                'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
                'bio' => 'Leading regulatory compliance, maritime safety, and international environmental convention strategy at India’s premier private shipping enterprise.',
            ],
            [
                'id' => 5,
                'name' => 'Dr. Kuntal Satpathi',
                'designation' => 'Team Lead (Solutions)',
                'company' => 'Energy Exemplar Singapore',
                'role' => 'Panelist',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
                'bio' => 'Expert in energy modeling, green fuel transition analytics, and operational simulation for maritime and energy infrastructure.',
            ],
        ];

        // Advisory Board 2027 Members
        $advisoryBoard = [
            [
                'name' => 'Cmde PR Hari, IN (Retd.)',
                'designation' => 'Chairman & Managing Director',
                'company' => 'Garden Reach Shipbuilders & Engineers Ltd (GRSE), Kolkata',
                'initials' => 'PRH',
            ],
            [
                'name' => 'Biju George',
                'designation' => 'Director (Operations)',
                'company' => 'Mazagon Dock Shipbuilders Ltd',
                'initials' => 'BG',
            ],
            [
                'name' => 'Tijo C. Mathew',
                'designation' => 'GM & Head – Ports & Harbours Business Segment',
                'company' => 'Heavy Civil Infrastructure, Larsen & Toubro Limited',
                'initials' => 'TCM',
            ],
            [
                'name' => 'Ajay Kumar Singh',
                'designation' => 'Head of Section, Maritime Advisory India',
                'company' => 'DNV',
                'initials' => 'AKS',
            ],
            [
                'name' => 'Mathew Johns',
                'designation' => 'Managing Director',
                'company' => 'Core Axis Maritime Solutions L.L.C',
                'initials' => 'MJ',
            ],
            [
                'name' => 'Amlan Bora',
                'designation' => 'Chief Representative for South Asia',
                'company' => 'Port of Rotterdam Authority',
                'initials' => 'AB',
            ],
            [
                'name' => 'Niranjan Nigalye',
                'designation' => 'CEO & Founder',
                'company' => 'Nirmon Marine & Offshore Design Pvt Ltd',
                'initials' => 'NN',
            ],
            [
                'name' => 'Dr. S. A. Sannasiraj',
                'designation' => 'Chair Professor, Department of Ocean Engineering',
                'company' => 'Indian Institute of Technology Madras (IIT Madras)',
                'initials' => 'SAS',
            ],
        ];

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
                'registration' => [
                    ['name' => 'Mazagon Dock Shipbuilders Limited', 'role' => 'Registration Area Sponsor', 'tag' => 'MDSL'],
                ],
                'lunch_coffee' => [
                    ['name' => 'ABS Marine Services Ltd', 'role' => 'Lunch & Coffee Sponsor', 'tag' => 'ABS'],
                    ['name' => 'GRSE (Garden Reach Shipbuilders & Engineers)', 'role' => 'Lunch & Coffee Sponsor', 'tag' => 'GRSE'],
                ],
                'table_top' => [
                    ['name' => 'Nirmon Marine & Offshore Design Pvt Ltd', 'role' => 'Table Top Sponsor', 'tag' => 'NIRMON'],
                ],
                'associate' => [
                    ['name' => 'KNK Ship Management', 'role' => 'Associate Sponsor', 'tag' => 'KNK'],
                    ['name' => 'Core Axis Maritime Solutions L.L.C', 'role' => 'Associate Sponsor', 'tag' => 'CORE AXIS'],
                ],
                'promoting' => [
                    ['name' => 'Port of Rotterdam', 'role' => 'Promoting Organisation', 'tag' => 'ROTTERDAM'],
                ],
                'supporting' => [
                    ['name' => 'Institute of Chartered Shipbrokers (Madras Branch)', 'role' => 'Supporting Organisation', 'tag' => 'ICS Madras'],
                    ['name' => 'INSA (Indian National Shipowners\' Association - ESTD. 1929)', 'role' => 'Supporting Organisation', 'tag' => 'INSA'],
                    ['name' => 'SAI (Shipyards Association of India)', 'role' => 'Supporting Organisation', 'tag' => 'SAI'],
                    ['name' => 'ASA (Asian Shipowners\' Association)', 'role' => 'Supporting Organisation', 'tag' => 'ASA'],
                    ['name' => 'Institution of Naval Architects', 'role' => 'Supporting Organisation', 'tag' => 'INA'],
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
        $awardCategories = [
            ['id' => 1, 'category' => 'Corporate Excellence', 'title' => 'Shipowner of the Year'],
            ['id' => 2, 'category' => 'Corporate Excellence', 'title' => 'Shipping Line of the Year'],
            ['id' => 3, 'category' => 'Infrastructure', 'title' => 'Port Developer of the Year'],
            ['id' => 4, 'category' => 'Infrastructure', 'title' => 'Emerging Port of the Year'],
            ['id' => 5, 'category' => 'Operations', 'title' => 'Ship Management Company of the Year'],
            ['id' => 6, 'category' => 'Operations', 'title' => 'Ship Agency of the Year'],
            ['id' => 7, 'category' => 'Manufacturing', 'title' => 'Shipyard of the Year'],
            ['id' => 8, 'category' => 'Innovation', 'title' => 'Maritime AI Startup of the Year'],
            ['id' => 9, 'category' => 'Regulatory Excellence', 'title' => 'Best Classification Society of the Year'],
            ['id' => 10, 'category' => 'Industry Leadership', 'title' => 'Best Maritime Association'],
            ['id' => 11, 'category' => 'Communications', 'title' => 'Best Maritime Digital Media'],
            ['id' => 12, 'category' => 'Services', 'title' => 'Best Service Provider – Maritime'],
            ['id' => 13, 'category' => 'Education', 'title' => 'Best Maritime University / Institute of the Year'],
            ['id' => 14, 'category' => 'Leadership', 'title' => 'CEO of the Year'],
            ['id' => 15, 'category' => 'Diversity & Inclusion', 'title' => 'Inspiring Woman Leader – Maritime Sector of the Year'],
            ['id' => 16, 'category' => 'Entrepreneurship', 'title' => 'Young Entrepreneur of the Year – Maritime'],
            ['id' => 17, 'category' => 'Industry Recognition', 'title' => 'Best Maritime Personality'],
            ['id' => 18, 'category' => 'Strategic Planning', 'title' => 'Excellence in Port Strategy'],
            ['id' => 19, 'category' => 'Government', 'title' => 'Excellence in Public Sector Leadership'],
            ['id' => 20, 'category' => 'Infrastructure', 'title' => 'Excellence in Port Development'],
            ['id' => 21, 'category' => 'Legal Excellence', 'title' => 'Excellence in Legal Maritime Affairs'],
            ['id' => 22, 'category' => 'Sustainability', 'title' => 'Excellence in Green Shipping Initiative'],
            ['id' => 23, 'category' => 'Corporate Responsibility', 'title' => 'Best CSR Initiative in Maritime Sector'],
            ['id' => 24, 'category' => 'Service Excellence', 'title' => 'Excellence in Maritime Services'],
            ['id' => 25, 'category' => 'Workplace Excellence', 'title' => 'Best Employer of the Year'],
            ['id' => 26, 'category' => 'Industry Impact', 'title' => 'Outstanding Contribution to the Global Maritime Industry'],
            ['id' => 27, 'category' => 'Career Excellence', 'title' => 'Lifetime Achievement Award – Maritime Services'],
            ['id' => 28, 'category' => 'Entrepreneurial Legacy', 'title' => 'Lifetime Achievement Award – Entrepreneurship'],
            ['id' => 29, 'category' => 'Technical Innovation', 'title' => 'Lifetime Achievement Award – Ship Design and Technology'],
            ['id' => 30, 'category' => 'Port Leadership', 'title' => 'Lifetime Achievement Award – Port Management'],
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
}
