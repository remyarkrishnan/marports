<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MARPORTS GLOBAL 2027 | World Summit on Maritime, Logistics Tech & DeepTech AI</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="MARPORTS GLOBAL 2027 is the premier international technology summit bringing together maritime pioneers, autonomous logistics innovators, supply chain leaders, and deeptech AI visionaries.">
    <meta name="keywords" content="MARPORTS GLOBAL, Maritime Tech, Port Automation, Logistics AI, DeepTech Summit 2027, Maritime Autonomous Navigation, Green Ports, Supply Chain Tech">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="bg-[#F7F5EF] text-[#17201D] font-sans antialiased selection:bg-[#D9A441] selection:text-[#0A1E3F]">
    @inertia
</body>
</html>
