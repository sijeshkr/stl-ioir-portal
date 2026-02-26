import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  EyeOff, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  Presentation,
  TrendingUp,
  Users,
  Target,
  Lightbulb
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">STL IOIR Social Media Strategy</h1>
              <p className="text-blue-100 text-lg">Pre-Launch, Launch & Post-Launch Plan | Feb 18 - May 31, 2026</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              {showDetails ? (
                <>
                  <EyeOff className="mr-2 h-5 w-5" />
                  High-Level View
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Detailed View
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">
              <Target className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="visuals">
              <ImageIcon className="mr-2 h-4 w-4" />
              Strategy Visuals
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Content Calendar
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              Post Library
            </TabsTrigger>
            <TabsTrigger value="downloads">
              <Download className="mr-2 h-4 w-4" />
              Downloads
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Executive Summary */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Executive Summary
                </CardTitle>
                <CardDescription className="text-base">
                  Strategic approach for launching the first independent IO/IR clinic in St. Louis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">Authority First, Referrals Primary</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Unlike typical medical practices that focus on direct patient acquisition, STL IOIR's success depends primarily on <strong>physician referrals</strong>. Therefore, our social media strategy inverts the traditional approach.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900">LinkedIn (60%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-700">Build authority with referring physicians</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-900">Facebook (30%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-orange-700">Educate patients and families</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-900">Instagram (10%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-purple-700">Secondary patient awareness</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-4">
                  <div className="space-y-2">
                    <Badge className="bg-primary text-white">Phase 1: Pre-Launch</Badge>
                    <h4 className="font-semibold">Feb 18 - Mar 7</h4>
                    <p className="text-sm text-muted-foreground">Build awareness & anticipation</p>
                    {showDetails && (
                      <ul className="text-sm space-y-1 text-muted-foreground mt-3">
                        <li>• 500+ followers</li>
                        <li>• Website traffic growth</li>
                        <li>• Physician awareness</li>
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-accent text-white">Phase 2: Launch Week</Badge>
                    <h4 className="font-semibold">Mar 10-14</h4>
                    <p className="text-sm text-muted-foreground">Maximize visibility & momentum</p>
                    {showDetails && (
                      <ul className="text-sm space-y-1 text-muted-foreground mt-3">
                        <li>• 2,000+ website visits</li>
                        <li>• Peak engagement</li>
                        <li>• Launch buzz</li>
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-green-600 text-white">Phase 3: Post-Launch</Badge>
                    <h4 className="font-semibold">Mar 15 - May 31</h4>
                    <p className="text-sm text-muted-foreground">Sustain engagement & build pipeline</p>
                    {showDetails && (
                      <ul className="text-sm space-y-1 text-muted-foreground mt-3">
                        <li>• 1,500+ followers</li>
                        <li>• 15+ referring physicians</li>
                        <li>• 50+ reviews</li>
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Strategic Insights */}
            {showDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Key Strategic Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">
                        <span className="font-semibold">Why LinkedIn Over Facebook?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-2">
                        <p>
                          <strong>One referring physician = 100 direct patients.</strong> If a medical oncologist sends 2-3 liver cancer patients per month, that's 24-36 cases per year from ONE relationship.
                        </p>
                        <p>
                          To get that same volume from direct patient marketing, you'd need to spend tens of thousands on ads. LinkedIn reaches referring physicians directly—you can target by job title and specialty.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">
                        <span className="font-semibold">"No Knife Needed" Positioning</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-2">
                        <p>
                          This is your core value proposition that resonates with both patients and physicians:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li><strong>For patients:</strong> 3mm pinhole vs large incision, less pain, faster recovery, outpatient care</li>
                          <li><strong>For physicians:</strong> Minimally invasive alternative when surgery isn't an option</li>
                        </ul>
                        <p className="pt-2">
                          <strong>Tagline:</strong> "Elite Expertise • Pinhole Precision • Rapid Recovery"
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left">
                        <span className="font-semibold">Paid Media Budget Recommendation</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-2">
                        <p>
                          <strong>$1,500-2,000 for Pre-Launch + Launch (Feb 18 - March 31)</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>LinkedIn Ads (50%): $800-1,000 targeting physicians</li>
                          <li>Facebook/Instagram Ads (40%): $600-800 targeting patients 40-70</li>
                          <li>Google Search Ads (10%): $200-300 for high-intent keywords</li>
                        </ul>
                        <p className="pt-2">
                          <strong>Expected ROI:</strong> 10-15x minimum. Organic reach for new pages is 2-5%. Without paid promotion, you'll get 5-10% of the results.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">
                        <span className="font-semibold">Dr. Vaheesan's Role</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-2">
                        <p>
                          <strong>Minimal time commitment, maximum impact:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>1-2 LinkedIn posts per month from personal profile (15 min/month)</li>
                          <li>2-3 short videos post-launch (1 hour total over 3 months)</li>
                          <li>Occasional comment engagement (5 min/week)</li>
                        </ul>
                        <p className="pt-2">
                          His personal LinkedIn has more reach and credibility than the company page. Physicians trust physicians. When he posts, they listen.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Success Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  90-Day Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Social Media Metrics</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        1,500+ total followers (LinkedIn 400, Facebook 800, Instagram 300)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        50,000+ total impressions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        5,000+ website visits from social
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-accent">Business Impact</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                        15+ active referring physicians
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                        12-18 cases/month referral velocity
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                        50+ Google reviews (4.8+ rating)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategy Visuals Tab */}
          <TabsContent value="visuals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Visualization Gallery</CardTitle>
                <CardDescription>
                  Click any image to view full size. Use these visuals in client presentations or internal meetings.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {[
                  { src: "/visuals/01_strategy_overview_funnel.png", title: "Authority First Strategy Funnel", desc: "Three-tier approach: Authority → Education → Action" },
                  { src: "/visuals/02_platform_strategy.png", title: "Platform Strategy & Allocation", desc: "LinkedIn 60%, Facebook 30%, Instagram 10%" },
                  { src: "/visuals/03_three_phase_timeline_v2.png", title: "90-Day Launch Timeline", desc: "Pre-Launch, Launch Week, Post-Launch phases" },
                  { src: "/visuals/04_content_pillars.png", title: "Four Content Pillars", desc: "Credibility, Education, Benefits, Referral Value" },
                  { src: "/visuals/05_no_knife_positioning.png", title: "No Knife Needed Positioning", desc: "The Pinhole Advantage comparison" },
                  { src: "/visuals/06_budget_allocation.png", title: "Paid Media Budget Allocation", desc: "$1,500-2,000 investment breakdown" },
                ].map((visual, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative group">
                      <img 
                        src={visual.src} 
                        alt={visual.title}
                        className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(visual.src, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base">{visual.title}</CardTitle>
                      <CardDescription className="text-sm">{visual.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Content Calendar</CardTitle>
                <CardDescription>
                  Week-by-week posting schedule from Feb 18 - May 31, 2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                    <h4 className="font-semibold text-primary mb-2">Week 1: Feb 18-24 - "Introducing STL IOIR"</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-blue-100 text-blue-900 border-blue-300">LinkedIn</Badge>
                          <span className="text-xs text-muted-foreground">Wed, Feb 19</span>
                        </div>
                        <p className="font-medium">Clinic Announcement - "Coming March 2026"</p>
                        <p className="text-muted-foreground text-xs mt-1">First independent IO/IR clinic in St. Louis</p>
                        <Badge className="mt-2 bg-accent text-white text-xs">Paid Boost: $100-150</Badge>
                      </div>
                      
                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-orange-100 text-orange-900 border-orange-300">Facebook</Badge>
                          <span className="text-xs text-muted-foreground">Mon, Feb 18</span>
                        </div>
                        <p className="font-medium">"A Critical Milestone in Cancer Care"</p>
                        <p className="text-muted-foreground text-xs mt-1">Announce clinic opening March 2026</p>
                      </div>

                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-orange-100 text-orange-900 border-orange-300">Facebook</Badge>
                          <span className="text-xs text-muted-foreground">Wed, Feb 20</span>
                        </div>
                        <p className="font-medium">"Meet Dr. Kirubahara Vaheesan"</p>
                        <p className="text-muted-foreground text-xs mt-1">30+ years, 30,000+ procedures, Top Doctor 5 years</p>
                      </div>

                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-purple-100 text-purple-900 border-purple-300">Instagram</Badge>
                          <span className="text-xs text-muted-foreground">Tue, Feb 19</span>
                        </div>
                        <p className="font-medium">Clinic announcement graphic</p>
                        <p className="text-muted-foreground text-xs mt-1">Same as Facebook announcement</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-accent p-4 rounded">
                    <h4 className="font-semibold text-accent mb-2">Week 2: Feb 25 - Mar 3 - "The Pinhole Advantage"</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-orange-100 text-orange-900 border-orange-300">Facebook</Badge>
                          <span className="text-xs text-muted-foreground">Mon, Feb 25</span>
                        </div>
                        <p className="font-medium">"No Knife Needed - Pinhole Advantage"</p>
                        <p className="text-muted-foreground text-xs mt-1">3mm pinhole vs large incision comparison</p>
                        <Badge className="mt-2 bg-accent text-white text-xs">Paid Boost: $100</Badge>
                      </div>

                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-blue-100 text-blue-900 border-blue-300">LinkedIn</Badge>
                          <span className="text-xs text-muted-foreground">Wed, Feb 26</span>
                        </div>
                        <p className="font-medium">"The Gap Offer for Physicians"</p>
                        <p className="text-muted-foreground text-xs mt-1">Fast turnaround: &lt;48hr biopsies, &lt;5 day consults</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                    <h4 className="font-semibold text-green-900 mb-2">Launch Week: Mar 10-14 - "Grand Opening"</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-blue-100 text-blue-900 border-blue-300">LinkedIn</Badge>
                          <span className="text-xs text-muted-foreground">Mon, Mar 10 - 8am</span>
                        </div>
                        <p className="font-medium">"We're Open! STL IOIR Launches Today"</p>
                        <p className="text-muted-foreground text-xs mt-1">Professional announcement, services, referral info</p>
                        <Badge className="mt-2 bg-accent text-white text-xs">Paid Boost: $200-300</Badge>
                      </div>

                      <div className="bg-white p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="bg-orange-100 text-orange-900 border-orange-300">Facebook</Badge>
                          <span className="text-xs text-muted-foreground">Mon, Mar 10 - 9am</span>
                        </div>
                        <p className="font-medium">"We're Open! Welcome to STL IOIR"</p>
                        <p className="text-muted-foreground text-xs mt-1">Celebration, clinic photos, services, CTA</p>
                        <Badge className="mt-2 bg-accent text-white text-xs">Paid Boost: $200-300</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <a href="/STL_IOIR_Content_Calendar.xlsx" download>
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Calendar (Excel)
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Library Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ready-to-Use Post Copy Library</CardTitle>
                <CardDescription>
                  Complete post templates for LinkedIn, Facebook, and Instagram. Copy and customize as needed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="linkedin-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600">LinkedIn</Badge>
                        <span className="font-semibold">Clinic Announcement (For Referring Physicians)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <div className="prose prose-sm max-w-none">
                          <p className="font-mono text-sm whitespace-pre-wrap">
{`Exciting news for the St. Louis medical community:

STL Interventional Oncology + Interventional Radiology Clinics opens March 2026 — the first independent, office-based IO/IR practice in the region.

Led by Dr. Kirubahara Vaheesan, MD, FSIR (30+ years experience, 30,000+ procedures, 400+ Y90 cases), we're bringing advanced minimally invasive cancer and vascular treatments to a comfortable, patient-centered setting.

Why this matters for your practice:
✓ Faster access: Consults within 5 days, biopsies < 48 hours
✓ Comprehensive IO services: Y90, TACE, Ablation, Pain Management
✓ Full IR capabilities: Vascular, Venous, Embolization, Drainage
✓ Collaborative care model: We work with your team, not replace it
✓ Office-based efficiency: Lower costs, better patient experience

Now accepting appointment requests for March.

Refer a patient: [link]
Questions? Reach Dr. Vaheesan directly: (314) 888-4647`}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">#InterventionalOncology</Badge>
                          <Badge variant="outline">#InterventionalRadiology</Badge>
                          <Badge variant="outline">#StLouis</Badge>
                          <Badge variant="outline">#PhysicianReferral</Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="facebook-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">Facebook</Badge>
                        <span className="font-semibold">Clinic Announcement (For Patients)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <div className="prose prose-sm max-w-none">
                          <p className="font-mono text-sm whitespace-pre-wrap">
{`🏥 A New Kind of Cancer Care is Coming to St. Louis

This March, STL Interventional Oncology + Interventional Radiology Clinics opens its doors — bringing advanced, minimally invasive cancer treatments to a comfortable, office-based setting.

What makes us different?
✨ No knife needed — just a tiny pinhole entry point
✨ Same-day procedures — go home to recover
✨ Less pain, faster recovery — back to life in days, not weeks
✨ Expert care — led by Dr. Vaheesan (30+ years, 30,000+ procedures, Top Doctor 5 years)

We treat:
• Liver, kidney, bone, and thyroid cancers
• Uterine fibroids
• Enlarged prostate (BPH)
• Hemorrhoids
• Vascular conditions
• And more

📅 Opening March 2026
📞 Request your appointment now: (314) 888-4647
🌐 www.stlioirclinics.com

Less Waiting. More Living. 💙`}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">#StLouis</Badge>
                          <Badge variant="outline">#CancerCare</Badge>
                          <Badge variant="outline">#MinimallyInvasive</Badge>
                          <Badge variant="outline">#NewClinic</Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="facebook-2">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">Facebook</Badge>
                        <span className="font-semibold">No Knife Needed - The Pinhole Advantage</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <div className="prose prose-sm max-w-none">
                          <p className="font-mono text-sm whitespace-pre-wrap">
{`✂️ No Knife Needed: The Pinhole Advantage

Imagine treating serious medical conditions — like cancer, fibroids, or an enlarged prostate — without traditional surgery.

No large incisions. No overnight hospital stays. No weeks of recovery.

That's the power of minimally invasive procedures.

At STL IOIR Clinics, we use a tiny, pinhole-sized entry point (less than 3mm — about the size of a pencil tip) to access and treat conditions that once required major surgery.

Here's what that means for you:
🩹 Less Pain — Minimal incision = minimal discomfort
⏱️ Faster Recovery — Most patients return to normal activities within days
🏠 Outpatient Care — Go home the same day
💰 Lower Costs — Office-based procedures are more affordable
❤️ Better Outcomes — Precision treatment with less risk

The choice is clear.

📞 (314) 888-4647
🌐 www.stlioirclinics.com

Less Waiting. More Living. 💙`}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">#PinholeAdvantage</Badge>
                          <Badge variant="outline">#MinimallyInvasive</Badge>
                          <Badge variant="outline">#NoKnifeNeeded</Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <a href="/STL_IOIR_Social_Media_Strategy_Complete.md" download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Complete Post Library
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Downloadable Resources</CardTitle>
                <CardDescription>
                  All strategy documents, calendars, and presentation materials in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-green-50 border-green-200 border-2">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">30-Day Authentic Content Plan</CardTitle>
                          <CardDescription className="text-sm">Markdown document</CardDescription>
                        </div>
                      </div>
                      <Badge className="mt-2 bg-green-600">NEW - Recommended</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete day-by-day content plan (Feb 10-March 21) with full post copies, non-salesy approach, execution checklist. Ready to use immediately.
                      </p>
                      <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                        <a href="/30_Day_Authentic_Content_Plan.md" download>
                          <Download className="mr-2 h-4 w-4" />
                          Download 30-Day Plan
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">Content Calendar</CardTitle>
                          <CardDescription className="text-sm">Excel spreadsheet</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete 90-day posting schedule with dates, platforms, themes, and metrics
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <a href="/STL_IOIR_Content_Calendar.xlsx" download>
                          <Download className="mr-2 h-4 w-4" />
                          Download Calendar
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-orange-600" />
                        <div>
                          <CardTitle className="text-lg">Complete Strategy</CardTitle>
                          <CardDescription className="text-sm">Markdown document</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Full 40+ page strategy document with all phases, content pillars, post copy library, and metrics
                      </p>
                      <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                        <a href="/STL_IOIR_Social_Media_Strategy_Complete.md" download>
                          <Download className="mr-2 h-4 w-4" />
                          Download Strategy
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Presentation className="h-8 w-8 text-purple-600" />
                        <div>
                          <CardTitle className="text-lg">Presentation Script</CardTitle>
                          <CardDescription className="text-sm">Markdown document</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        High-level client presentation script with slide-by-slide talking points and Q&A responses
                      </p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                        <a href="/STL_IOIR_Presentation_Script.md" download>
                          <Download className="mr-2 h-4 w-4" />
                          Download Script
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">Strategy Visuals</CardTitle>
                          <CardDescription className="text-sm">6 PNG images</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        All 6 professional strategy diagrams (funnel, platform, timeline, pillars, positioning, budget)
                      </p>
                      <div className="space-y-2">
                        {[
                          { file: "01_strategy_overview_funnel.png", name: "Strategy Funnel" },
                          { file: "02_platform_strategy.png", name: "Platform Strategy" },
                          { file: "03_three_phase_timeline_v2.png", name: "Timeline" },
                          { file: "04_content_pillars.png", name: "Content Pillars" },
                          { file: "05_no_knife_positioning.png", name: "Positioning" },
                          { file: "06_budget_allocation.png", name: "Budget" },
                        ].map((visual, idx) => (
                          <Button key={idx} variant="outline" size="sm" className="w-full justify-start" asChild>
                            <a href={`/visuals/${visual.file}`} download>
                              <Download className="mr-2 h-3 w-3" />
                              {visual.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>STL Interventional Oncology + Interventional Radiology Clinics</p>
          <p className="mt-1">Social Media Strategy Dashboard | February - May 2026</p>
          <p className="mt-4 text-xs">
            This dashboard is designed for both client presentation (high-level view) and team execution (detailed view).
            <br />
            Toggle between views using the button in the header.
          </p>
        </div>
      </footer>
    </div>
  );
}
