<?php

namespace Database\Seeders;

use App\Models\Speaker;
use Illuminate\Database\Seeder;

class SpeakersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $speakers = [
            [
                'id' => 1,
                'name' => 'Antony Prince',
                'designation' => 'President & CEO',
                'company' => 'Smart Engineering & Design Solutions Ltd.',
                'role' => 'Panelist',
                'image' => '/images/speakers/antony-prince.jpg',
                'linkedin' => 'https://www.linkedin.com/in/antony-prince-a0353b73/',
                'sort_order' => 1,
                'is_active' => true,
                'bio_file' => null,
                'bio' => "Mr. Antony Prince is an internationally acclaimed maritime leader, naval architect, and marine engineering consultant whose distinguished career spans more than five decades across Japan, India, China, Korea, Singapore, Europe, Canada, and the Bahamas. Widely respected for his visionary leadership in ship design, engineering innovation, and maritime consultancy, he has played a transformative role in strengthening global shipbuilding practices while advancing India's emergence as a centre for indigenous maritime design and engineering excellence.\n\nCurrently serving as President & CEO of Smart Engineering & Design Solutions Ltd. (SEDS), Kochi, India, Mr. Prince is also President of GTR Campbell Marine Consultants Ltd. and Algoship Designers Ltd., Nassau, Bahamas. Through his leadership, these organisations have become globally recognised for delivering technically sophisticated, commercially viable, and internationally benchmarked ship design solutions for both commercial and defence sectors.\n\nA firm believer in Mahatma Gandhi's philosophy, \"You must be the change you want to see in the world,\" Mr. Prince has consistently demonstrated how vision, discipline, and integrity can reshape industries and empower future generations. His professional journey reflects a lifelong commitment to technological excellence, workforce development, and sustainable maritime innovation.\n\nA native of Kochi, Kerala, Mr. Antony Prince graduated in Mechanical Engineering from TKM College of Engineering in 1968. Inspired by India's post-independence industrial aspirations and guided by an unwavering determination to contribute to nation-building, he began his professional journey in the maritime sector at a time when industrial opportunities in India remained limited.\n\nIn 1972, Mr. Prince joined GTR Campbell in Japan under the mentorship of the legendary naval architect George T.R. Campbell, a pioneering force behind Japan's post-war shipbuilding transformation. Over nearly 17 years in Japan, he acquired extensive expertise in advanced shipbuilding methodologies, precision engineering, structured production systems, and modern naval architecture.\n\nMr. Prince's exceptional technical capability and strategic vision earned him progressive leadership responsibilities within GTR Campbell, culminating in his appointment as President of GTR Campbell International Ltd., Nassau, Bahamas, in 1989. Significantly, he became the first and only Indian—and among the few Asians—to lead this internationally respected maritime organisation. Under his stewardship, GTR Campbell Marine Consultants has played a vital role in the successful design and construction of more than 150 vessels worldwide, serving shipowners, shipyards, and maritime stakeholders across multiple continents. Several vessels developed under his leadership have received international recognition, including being honoured among the \"Significant Ships of the Year\" by the Royal Institution of Naval Architects (RINA), United Kingdom.\n\nOne of Mr. Prince's landmark achievements came in the 1990s with the development of the innovative \"Fantasy – Ship of the Future\" concept, redefining the 20,000–30,000 DWT handy-size bulk carrier segment through enhanced efficiency, optimised production methodologies, and standardised high-performance design principles.\n\nIn 2003, he facilitated the placement of six export bulk carrier orders at Cochin Shipyard Limited and four export vessel orders at Hindustan Shipyard Limited, Visakhapatnam, marking a major milestone in India's emergence as a competitive global shipbuilding nation.\n\nDriven by a vision to establish strong indigenous maritime design capability, Mr. Prince founded Smart Engineering & Design Solutions Ltd. (SEDS) in 2007 in Kochi, India. Today, SEDS delivers comprehensive engineering and consultancy services across commercial, defence, and specialised vessel categories. Through SEDS, he has mentored and trained more than 500 engineers, championing the vision of \"Design in India; Make in India\".",
            ],
            [
                'id' => 2,
                'name' => 'Nikita Singla',
                'designation' => 'Visiting Fellow',
                'company' => 'Isaac Centre for Public Policy, Ashoka University',
                'role' => 'Moderator',
                'image' => '/images/speakers/nikita-singla.jpeg',
                'linkedin' => 'https://www.linkedin.com/in/nikita-singla-02779018/',
                'sort_order' => 2,
                'is_active' => true,
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
                'sort_order' => 3,
                'is_active' => true,
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
                'sort_order' => 4,
                'is_active' => true,
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
                'sort_order' => 5,
                'is_active' => true,
                'bio' => "Dr. Kuntal Satpathi is an energy markets and power systems specialist with deep experience delivering modelling, advisory, and implementation projects across Asia‑Pacific. He focuses on energy systems modelling, client advisory, and the design and delivery of PLEXOS‑based analytical frameworks and training programs.\n\nIn recent years, he has leveraged PLEXOS to conduct decarbonization studies in the marine sector and has contributed to the development of a green shipping corridor evaluation framework. Earlier in his career, he was involved in a major power generation project in India and has developed strong expertise in the operation, control, and protection of emerging power networks.",
            ],
        ];

        foreach ($speakers as $speakerData) {
            Speaker::updateOrCreate(
                ['name' => $speakerData['name']],
                $speakerData
            );
        }
    }
}
