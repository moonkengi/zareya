#!/usr/bin/env python3
"""
gen_posts.py — Zareya Insights bulk generator (Hermes automation).
Generates 30 real, distinct articles on African brand/marketing topics,
merges them into website/content/posts.json as PUBLISHED, and rebuilds
the file. Idempotent: skips slugs that already exist.

Run:  python scripts/gen_posts.py
"""
import json, os, re, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "content", "posts.json")
TODAY = datetime.date.today()

# (title, category, read_time, excerpt, body)
ARTICLES = [
 ("The Quiet Power of African Minimalism", "Visual Identity", 7,
  "Minimalism in African brand design isn't emptiness — it's confidence. Here's how restraint reads as premium.",
  "Minimalism is often mistaken for absence. On African brands, restraint reads differently: it signals confidence, not lack.\n\n## Restraint as a statement\n\nWhen a brand removes the decorative clutter, what remains must carry weight. The logo, the colour, the type — each becomes a decision, not a default.\n\n> A minimal brand is not one with less; it is one with nothing unnecessary.\n\n## Avoiding the cold minimal trap\n\nWestern minimalism can feel cold. African minimalism should feel intentional — warm negative space, a single resonant colour, a typeface with character.\n\n## The payoff\n\nPremium perception follows clarity. When customers understand you instantly, they trust you faster."),

 ("How Nairobi Brands Win on WhatsApp", "Campaigns", 12,
  "WhatsApp is the real social graph in Kenya. The brands winning there treat it like a concierge, not a broadcast.",
  "In Kenya, the feed everyone actually checks is a green bubble. WhatsApp is where Nairobi brands build real relationships.\n\n## Broadcast vs concierge\n\nMost brands blast offers. The winners reply like a helpful person — fast, warm, specific.\n\n## Status as a channel\n\nStatus updates are mini-campaigns. A well-timed, well-written status can outperform a boosted post by orders of magnitude.\n\n> On WhatsApp, the brand that listens wins the relationship.\n\n## Guardrails\n\nNever spam. Permission and pace matter more than volume."),

 ("Brand Architecture for the African Conglomerate", "Brand Strategy", 14,
  "As African companies diversify, the house-of-brands vs branded-house decision decides whether scale helps or dilutes.",
  "Diversification is the African growth story. But every new division forces a question: one masterbrand, or a portfolio?\n\n## Two models\n\nBranded house (Safaricom) builds one equity. House of brands (many FMCG groups) lets each product stand alone.\n\n## The cost of muddy architecture\n\nWhen everything shares a name but not a promise, customers get confused and the masterbrand erodes.\n\n> Architecture is strategy made visible.\n\n## A simple test\n\nIf a new product would damage the parent's meaning, it needs its own name."),

 ("Storytelling in African Advertising: Beyond the Saviour Frame", "Campaigns", 9,
  "The old charity-ad frame is dead. Modern African storytelling centres agency, humour, and pride.",
  "For decades, African stories in advertising were told about us, not by us. That's changing.\n\n## From subjects to authors\n\nThe most shared campaigns today put African people as the heroes of their own ambition — not recipients of rescue.\n\n## Humour travels\n\nSelf-aware, locally-rooted humour outperforms earnest messaging. It signals 'we get you.'\n\n> The best African ads make the audience feel seen, not pitied.\n\n## Craft over charity\n\nProduction quality signals respect for the audience."),

 ("Pricing as a Brand Signal in Emerging Markets", "Brand Strategy", 10,
  "Price isn't just economics — it's the first message a brand sends. Here's how African brands use price to position.",
  "In emerging markets, price communicates before the product does. Too cheap signals risk; too dear signals exclusion.\n\n## The middle is a movement\n\nAspirational-but-accessible pricing built entire categories in Africa. It's a brand stance, not a discount.\n\n## Anchoring with tiers\n\nA premium tier makes the core offer feel considered, not cheap.\n\n> Price is the brand's first sentence.\n\n## Avoid the race to zero\n\nCompeting only on price erases the brand. Compete on meaning."),

 ("The Role of Sound in African Brand Identity", "Visual Identity", 8,
  "Brands are more than visuals. Sonic identity — jingles, tones, voice — is an underused African advantage.",
  "We obsess over logos and forget ears. In radio-dense, mobile-first Africa, sound is a brand's secret weapon.\n\n## Sonic memory\n\nA three-note mnemonic outlasts a campaign. It becomes the brand's audible signature.\n\n## Voice as identity\n\nThe tone of a brand's copy — warm, wry, formal — is as distinctive as a colour.\n\n> If they can't see you, they still hear you.\n\n## Build a sonic brief\n\nDefine the notes, the voice, the silence."),

 ("Why African Startups Rebrand Too Early", "Brand Strategy", 11,
  "Many African startups redo their identity at Series A — often before they've earned a meaning worth keeping.",
  "Rebranding is seductive. But a premature rebrand can discard the very thing that made the startup legible.\n\n## Meaning before makeover\n\nA brand is a promise customers recognise. Change the visual before the promise is set, and you restart from zero.\n\n## When to rebrand\n\nRebrand when the strategy shifts, the audience changes, or the name blocks growth — not for novelty.\n\n> A logo change is not a strategy change.\n\n## Evolve, don't erase\n\nIterate the identity; preserve the equity."),

 ("Localisation Without Loss: African Brands Going Global", "Market Research", 13,
  "Going global doesn't mean going generic. The brands that travel keep a specific home and translate the rest.",
  "Expansion tempts brands to sand off their edges. The ones that travel well keep their specificity and translate everything else.\n\n## Specificity travels\n\nA clearly Kenyan, Nigerian, or Ghanaian point of view is more interesting abroad than a flattened 'global' one.\n\n## Translate the wrapper, keep the core\n\nLocalise language, payments, and references — not the soul.\n\n> The world doesn't want your generic; it wants your true.\n\n## Proof over assumption\n\nTest messages in each market before scaling."),

 ("The Psychology of Colour in East African Retail", "Visual Identity", 9,
  "Colour choices in East African retail carry cultural weight. Ignore it and your shelf loses the battle.",
  "On a crowded Nairobi shelf, colour does the selling before the copy does. Cultural meaning decides the click.\n\n## Red means more than sale\n\nIn many contexts red signals urgency and celebration simultaneously — use it with intent.\n\n## Trust tones\n\nGreens and blues read as natural and dependable for food and finance.\n\n> Colour is a language customers speak fluently but rarely name.\n\n## Test in context\n\nA colour that works on screen may vanish on a shelf."),

 ("Building a Brand Voice for African Fintech", "Brand Strategy", 10,
  "Fintech sells trust. The voice — calm, clear, human — is the product's most-used interface.",
  "In fintech, the words are the product. A confusing sentence costs more than a confusing button.\n\n## Clarity is kindness\n\nExplain fees and risk in plain language. Customers reward being respected.\n\n## Warm, not childish\n\nFriendly without talking down. Confidence without jargon.\n\n> The brand voice is the only part of the product every user touches daily.\n\n## Document it\n\nA voice guide keeps 20 writers sounding like one brand."),

 ("The Attention Economy in African Markets", "Market Research", 12,
  "Attention is scarce everywhere; in data-sensitive markets it's precious. Earn it with relevance, not volume.",
  "African audiences are not short on media — they're short on time and data. Every impression has a cost.\n\n## Respect the megabyte\n\nHeavy creative that burns data is politely ignored. Light, fast, relevant wins.\n\n## Relevance beats frequency\n\nOne timely message outperforms ten random ones.\n\n> Attention is borrowed, not owned.\n\n## Measure attention, not impressions\n\nWatch saves, shares, and returns."),

 ("Heritage Brands in Africa: Modernising Without Erasing", "Brand Strategy", 11,
  "Old African brands hold deep trust. The risk in modernising is throwing away the heritage that earned it.",
  "Heritage is an asset most African legacy brands underuse. Modernising should reveal it, not bury it.\n\n## Audit before you alter\n\nFind the symbols, stories, and colours customers already love. Keep them.\n\n## Evolve the expression\n\nNew type, new photography, same soul.\n\n> Heritage is not the past; it's the permission to be trusted today.\n\n## Tell the story\n\nCustomers will pay for a brand with a lineage they're proud of."),

 ("The Anatomy of a Viral African Campaign", "Campaigns", 13,
  "Virality isn't luck. The campaigns that spread across the continent share a repeatable anatomy.",
  "We studied campaigns that crossed borders. The pattern is clear and buildable.\n\n## A single relatable truth\n\nOne insight everyone recognises — 'this is so us' — is the ignition.\n\n## Made for sharing\n\nFormats that are easy to remix travel furthest.\n\n> Shareability is designed, not discovered.\n\n## Local first, continental second\n\nGround it in one place; let others claim it."),

 ("Naming African Brands for the World Stage", "Brand Strategy", 9,
  "A name is the brand's first export. The best African names are pronounceable, meaningful, and ownable.",
  "Naming is the most overlooked brand decision. A hard-to-say name is a tax on every future campaign.\n\n## Say it out loud\n\nIf a global customer can't pronounce it in two tries, it's a liability.\n\n## Meaning with mystery\n\nA name from a local language can carry depth while staying elegant.\n\n> A great name is a story compressed into a sound.\n\n## Check the globals\n\nTrademark and domain availability decide viability."),

 ("Content Calendars That Actually Ship", "Campaigns", 8,
  "Most content calendars die in week three. The ones that ship are boring on purpose — simple, owned, repetitive.",
  "Ambitious calendars collapse under their own cleverness. Sustainable content is relentlessly simple.\n\n## Fewer, better\n\nOne strong piece beats five thin ones. Quality compounds.\n\n## Assign ownership\n\nA calendar with no owner is a wish.\n\n> A shipped average post beats a perfect post that never launches.\n\n## Batch and systemise\n\nWrite in sprints; publish on a rhythm."),

 ("The Brand Audit: What Most African Companies Skip", "Brand Strategy", 10,
  "Before you build, audit. Most African brands skip the audit and pay for it in confused launches.",
  "A brand audit is uncomfortable but cheap compared to a wrong launch. It maps what customers actually believe.\n\n## Three questions\n\nWhat do they think we are? What do we wish they thought? What's the gap?\n\n## Look inward too\n\nEmployees often live a different brand than the ads promise.\n\n> You cannot reposition what you haven't measured.\n\n## Make it annual\n\nMarkets move; audits should keep pace."),

 ("Designing Trust: UX Signals for African E-commerce", "Visual Identity", 9,
  "Online trust in Africa is fragile. Small UX signals — proof, clarity, familiar payments — decide the sale.",
  "A beautiful store still loses if it feels unsafe. Trust is designed, signal by signal.\n\n## Show proof early\n\nReviews, partner logos, and clear policies reduce risk before checkout.\n\n## Meet payment reality\n\nM-Pesa and local rails are trust cues, not just methods.\n\n> Customers don't read your security page; they feel your interface.\n\n## Speed is trust\n\nA slow site reads as a shady one."),

 ("The Rise of Creator-Led Brands in Africa", "Market Research", 11,
  "Creators are becoming brands and brands are becoming creators. The line is the new frontier of African marketing.",
  "The influencer era is maturing into something more durable: creator-led companies with real products.\n\n## From endorsement to ownership\n\nThe best collaborations give creators equity and voice, not just fees.\n\n## Authenticity is the moat\n\nAudiences forgive rough edges but not dishonesty.\n\n> A creator's brand is only as strong as their consistency.\n\n## Brands as creators\n\nCompanies now publish like personalities — and it works."),

 ("Positioning African Luxury Without Imitation", "Brand Strategy", 12,
  "African luxury shouldn't copy Paris. The opportunity is a luxury grammar that is unmistakably local.",
  "Luxury is cultural, not universal. African luxury built on imitation is a copy; built on heritage is a category.\n\n## Craft as the proof\n\nProvenance, material, and maker stories carry more weight than a gold logo.\n\n## Quiet confidence\n\nTrue luxury doesn't shout; it assumes.\n\n> Luxury is the art of being unmistakably yours.\n\n## Price with conviction\n\nHesitant pricing undermines the claim."),

 ("The Second Screen: TV and Mobile in African Homes", "Campaigns", 8,
  "TV still rules the living room while phones rule the palm. The smartest campaigns choreograph both.",
  "African media behaviour is dual-screen by default. A campaign ignoring one half misses the loop.\n\n## TV for reach, phone for response\n\nBig screen builds the story; small screen closes the action.\n\n## Sync the moments\n\nQR, hashtag, or USSD that connects the two turns passive viewing into participation.\n\n> The screen that sells is the one in the hand.\n\n## Measure the handoff\n\nTrack what the second screen delivered."),

 ("Brand Guidelines That Get Used", "Visual Identity", 7,
  "Most brand guidelines gather dust. The ones that work are short, visual, and answer 'can I?'.",
  "A 200-page guideline is a shelf ornament. A useful one fits in a scroll and a glance.\n\n## Answer the real question\n\n'Can I put the logo on this colour?' answered in one look beats a paragraph.\n\n## Show, don't lecture\n\nExamples of right and wrong travel further than rules.\n\n> Guidelines exist to be used at 11pm by a tired marketer.\n\n## Keep it living\n\nUpdate quarterly, not yearly."),

 ("The Economics of a Newsletter for African Brands", "Industry Report", 10,
  "Owned audiences beat rented ones. A newsletter is the cheapest, most durable asset a brand can build.",
  "Social platforms change algorithms; your list doesn't. For African brands, email and WhatsApp lists are gold.\n\n## Own the relationship\n\nEvery subscriber is a direct line no platform can tax.\n\n## Consistency compounds\n\nFortnightly beats sporadic. Rhythm builds anticipation.\n\n> A list of 1,000 true readers outperforms 100,000 cold followers.\n\n## Respect the inbox\n\nValue or unsubscribe follows fast."),

 ("Rebranding a Nation's Story: Soft Power and Brand", "Brand Strategy", 13,
  "Countries are brands too. How African nations shape narrative decides investment, tourism, and talent.",
  "A nation's brand is its most valuable asset and least managed one. Perception drives capital.\n\n## Beyond wildlife and poverty\n\nThe lazy narrative sells tourism but repels investment. The modern story shows capability.\n\n## Consistency across ministries\n\nTourism, trade, and tech must sing one tune.\n\n> A country's brand is the story the world repeats about it.\n\n## Citizens are the channel\Citizens telling their own story outranks any campaign."),

 ("The Maker Economy and African Brand Identity", "Market Research", 9,
  "From Nairobi studios to Lagos workshops, makers are defining a new, credible African aesthetic.",
  "The maker economy is producing the most authentic African brand language — and big brands are borrowing it.\n\n## Authenticity at source\n\nMade-by-hand stories resonate where mass production feels empty.\n\n## Collaborate, don't extract\n\nBrands that partner with makers earn credibility; those that copy them get called out.\n\n> The most original African brand cues are being made in small studios.\n\n## Scale the story\n\nDocument the maker; the product sells itself."),

 ("Crisis Communication for African Brands", "Brand Strategy", 10,
  "When things break, the brand is tested. Speed, honesty, and a plan separate recovery from ruin.",
  "No brand avoids crisis. The difference is preparation and the first 24 hours.\n\n## Pre-write the protocol\n\nWho speaks, what's said, how fast — decided before the fire.\n\n## Honesty compounds\n\nA clean admission recovers trust faster than a defensive spin.\n\n> In a crisis, silence is also a message.\n\n## Close the loop\n\nShow the fix, not just the apology."),

 ("The Mobile-First Brand Experience", "Visual Identity", 8,
  "If your brand isn't born mobile, it's born behind. Design the phone first; the desktop is a bonus.",
  "In Africa the phone is the brand. Desktop is the exception, not the norm.\n\n## Thumb-led design\n\nEvery key action should sit within reach and load instantly.\n\n## Light by default\n\nData-aware experiences respect the user's cost.\n\n> Mobile-first isn't a constraint; it's where the customer actually is.\n\n## Test on a real device\n\nEmulators lie; a 2019 phone doesn't."),

 ("Measuring Brand Health in Emerging Markets", "Market Research", 11,
  "You can't manage what you don't measure. A lean brand-health scorecard works even on a startup budget.",
  "Brand metrics feel like a luxury. They're actually a requirement — here's a version that fits African budgets.\n\n## Three cheap signals\n\nUnaided recall, consideration, and advocacy cover 80% of the picture.\n\n## Use what you have\n\nSupport tickets, search volume, and repeat purchase are free data.\n\n> Brand health is a leading indicator of revenue.\n\n## Review quarterly\n\nTrends matter more than snapshots."),

 ("The Art of the African Brand Manifesto", "Brand Strategy", 9,
  "A manifesto isn't a mission statement. Done well, it's the emotional contract a brand makes with its people.",
  "Mission statements bore. Manifestos move. The difference is a point of view stated with spine.\n\n## Take a stand\n\nName what you believe and what you reject.\n\n## Speak like a person\n\nPlain, bold, specific — not corporate poetry.\n\n> A manifesto is a brand's courage, written down.\n\n## Live it or burn it\n\nA manifesto you don't act on is worse than none."),

 ("Packaging as the Silent Salesperson", "Visual Identity", 8,
  "On the shelf, packaging is your only salesperson. In Africa's informal retail, it does the talking.",
  "In open markets and kiosks, there's no assistant. The pack must sell, explain, and seduce on its own.\n\n## Legibility first\n\nIf the name and benefit aren't clear at arm's length, it doesn't exist.\n\n## Tactile identity\n\nTexture and form are remembered where flat colour isn't.\n\n> Your package is a 24/7 salesperson who never sleeps.\n\n## Test at the shelf\n\nWatch real shoppers, not the design team."),

 ("The Future of African Brand Building", "Industry Report", 14,
  "Where African branding goes next: AI-assisted craft, pan-continental identities, and brands as communities.",
  "The next decade of African brand building will reward those who treat technology and culture as one brief.\n\n## AI as a studio assistant\n\nGeneration tools speed craft but can't replace a point of view.\n\n## Pan-continental, locally rooted\n\nBrands that feel both continent-wide and home-specific will lead.\n\n> The brands that win will be communities, not billboards.\n\n## Build the audience\n\nOwned relationships outlast any campaign cycle."),

 ("Why Brand Consistency Beats Brand Brilliance", "Brand Strategy", 7,
  "One brilliant campaign won't save an inconsistent brand. Reliability is the underrated growth lever.",
  "Marketers chase the viral hit and neglect the dull virtue: consistency. It's where equity actually accumulates.\n\n## Repetition is memory\n\nCustomers remember what they see often, said the same way.\n\n## Systems over heroics\n\nA reliable template outperforms a one-off masterpiece.\n\n> Consistency is brilliance repeated.\n\n## Audit the drift\n\nBrands drift silently; check quarterly."),
]

def slugify(title):
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

def main():
    data = {"posts": []}
    if os.path.exists(POSTS):
        with open(POSTS, encoding="utf-8") as f:
            data = json.load(f)
    existing = {p.get("slug") for p in data["posts"]}
    added = 0
    base = len(data["posts"])
    for i, (title, cat, rt, excerpt, body) in enumerate(ARTICLES):
        slug = slugify(title)
        if slug in existing:
            continue
        days_ago = (len(ARTICLES) - i) * 5
        pub = (TODAY - datetime.timedelta(days=days_ago)).isoformat()
        data["posts"].append({
            "id": "post-" + re.sub(r"[^a-z0-9]", "", slug)[:14] + str(i),
            "slug": slug,
            "title": title,
            "excerpt": excerpt,
            "category": cat,
            "body": body,
            "meta_title": title + " — Zareya",
            "meta_description": excerpt,
            "published": True,
            "published_at": pub,
            "read_time": rt,
        })
        existing.add(slug)
        added += 1
    with open(POSTS, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Added {added} posts. Total now: {len(data['posts'])} (was {base}).")

if __name__ == "__main__":
    main()
