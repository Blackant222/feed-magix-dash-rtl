import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "@/components/BottomNav";
import {
  Camera,
  PawPrint,
  Cat,
  Dog,
  ChevronLeft,
  BarChart3,
  Clock3,
  Plus,
  Heart,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatJalaliDate, toPersianDigits } from "@/utils/persian";

interface DashboardData {
  user: {
    id: string;
    displayName: string;
    email: string;
  };
  recentScans: Array<{
    id: string;
    foodName: string;
    brandName: string;
    imageUrl: string;
    analysisDate: string;
    overallScore: number;
  }>;
  pets: Array<{
    id: string;
    name: string;
    species: "dog" | "cat";
    photoUrl?: string;
    age: number;
  }>;
  stats: {
    totalScansThisMonth: number;
    favoriteFoodsCount: number;
    averageHealthScore: number;
  };
  recentActivity: Array<{
    id: string;
    type: "scan" | "pet_added" | "favorite_added";
    description: string;
    timestamp: string;
  }>;
}

function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(Math.round(value * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className="tabular-nums">{toPersianDigits(display)}</span>;
}

const mockData: DashboardData = {
  user: { id: "1", displayName: "علی", email: "ali@example.com" },
  recentScans: [
    {
      id: "s1",
      foodName: "غذای خشک گربه",
      brandName: "Whiskas",
      imageUrl: "/placeholder.svg",
      analysisDate: new Date().toISOString(),
      overallScore: 8,
    },
    {
      id: "s2",
      foodName: "غذای سگ بالغ",
      brandName: "Royal Canin",
      imageUrl: "/placeholder.svg",
      analysisDate: new Date(Date.now() - 86400000).toISOString(),
      overallScore: 9,
    },
    {
      id: "s3",
      foodName: "اسنک جویدنی",
      brandName: "Pedigree",
      imageUrl: "/placeholder.svg",
      analysisDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      overallScore: 7,
    },
  ],
  pets: [
    { id: "p1", name: "لونا", species: "cat", age: 2, photoUrl: undefined },
    { id: "p2", name: "راکی", species: "dog", age: 4, photoUrl: undefined },
  ],
  stats: { totalScansThisMonth: 12, favoriteFoodsCount: 5, averageHealthScore: 8 },
  recentActivity: [
    {
      id: "a1",
      type: "scan",
      description: "اسکن جدید برای غذای گربه ثبت شد",
      timestamp: new Date().toISOString(),
    },
    {
      id: "a2",
      type: "pet_added",
      description: "حیوان جدید به نام راکی اضافه شد",
      timestamp: new Date(Date.now() - 3600_000).toISOString(),
    },
    {
      id: "a3",
      type: "favorite_added",
      description: "غذا به علاقه‌مندی‌ها افزوده شد",
      timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
    },
  ],
};

const Index = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const onQuickScan = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      navigate("/camera");
    } catch (e) {
      toast({ title: "خطا", description: "خطا در بارگذاری دوربین", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const userName = data?.user.displayName ?? "کاربر";

  const activityIcon = (type: DashboardData["recentActivity"][number]["type"]) => {
    switch (type) {
      case "scan":
        return <Camera className="h-4 w-4 text-primary" />;
      case "pet_added":
        return <PawPrint className="h-4 w-4 text-secondary" />;
      case "favorite_added":
        return <Heart className="h-4 w-4 text-secondary" />;
      default:
        return <Clock3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const gridCols = "grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <header className="h-20 sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center shadow-sm">
              <PawPrint className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="leading-none">
              <span className="block text-lg font-semibold">فیدمجیکس</span>
              <span className="block text-xs text-muted-foreground">داشبورد</span>
            </div>
          </div>

          <nav aria-label="breadcrumb" className="hidden md:block">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li className="text-foreground">داشبورد اصلی</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-sm hidden sm:block">سلام {userName}</div>
            <Avatar>
              <AvatarImage alt="نمایه کاربر" src="/favicon.ico" />
              <AvatarFallback>کاربر</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 pb-28 lg:pb-10">
        <h1 className="sr-only">داشبورد اصلی فیدمجیکس</h1>

        {/* Row 1 - Welcome */}
        <section aria-label="خوش‌آمدگویی" className="mb-4 md:mb-6">
          <Card className="bg-gradient-to-l from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                {loading ? (
                  <>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </>
                ) : (
                  <>
                    <CardTitle className="text-2xl md:text-3xl">خوش آمدید، {userName}</CardTitle>
                    <CardDescription>آماده تحلیل غذای حیوان خانگی‌تان هستید؟</CardDescription>
                  </>
                )}
              </div>
              <PawPrint className="h-10 w-10 text-primary" aria-hidden="true" />
            </CardHeader>
          </Card>
        </section>

        {/* Row 2 - Quick Scan */}
        <section aria-label="اقدام سریع" className="mb-4 md:mb-6">
          <Button
            size="xl"
            variant="hero"
            className="w-full"
            onClick={onQuickScan}
            aria-label="اسکن جدید غذای حیوان خانگی"
          >
            <Camera className="h-6 w-6" />
            <span>اسکن جدید غذای حیوان خانگی</span>
          </Button>
          {loading && (
            <div className="flex items-center justify-center mt-3 text-sm text-muted-foreground">
              <Clock3 className="mr-2 h-4 w-4 animate-spin" />
              <span>در حال بارگذاری دوربین...</span>
            </div>
          )}
        </section>

        {/* Row 3 - Cards Grid */}
        <section className={gridCols + " mb-4 md:mb-6"} aria-label="کارت‌های داشبورد">
          {/* Recent Scans */}
          <Card className="lg:col-span-1 md:col-span-2 animate-enter">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xl">آخرین اسکن‌ها</CardTitle>
              <Button variant="link" onClick={() => navigate("/history")}>مشاهده همه</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex gap-4 overflow-hidden">
                  <Skeleton className="h-28 w-28 rounded-lg" />
                  <Skeleton className="h-28 w-28 rounded-lg" />
                  <Skeleton className="h-28 w-28 rounded-lg" />
                </div>
              ) : data && data.recentScans.length > 0 ? (
                <div
                  dir="rtl"
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 pr-1"
                >
                  {data.recentScans.map((scan) => (
                    <button
                      key={scan.id}
                      onClick={() => navigate(`/history/${scan.id}`)}
                      className="min-w-[11rem] text-right snap-start bg-card rounded-lg border hover:shadow-lg transition-transform hover:scale-105"
                      aria-label={`مشاهده اسکن ${scan.brandName}`}
                    >
                      <div className="h-28 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={scan.imageUrl}
                          alt={`تصویر ${scan.foodName}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="font-medium line-clamp-1">{scan.brandName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatJalaliDate(scan.analysisDate)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  شروع اولین اسکن خود را کنید
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pet Profiles */}
          <Card className="animate-enter">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xl">حیوانات خانگی شما</CardTitle>
              <Button variant="link" onClick={() => navigate("/pets")}>مدیریت حیوانات</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              ) : data && data.pets.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {data.pets.slice(0, 4).map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => navigate(`/pets/${pet.id}`)}
                      className="group flex items-center gap-3 p-3 rounded-lg border hover:shadow-lg transition-transform hover:scale-[1.02] text-right"
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 grid place-items-center">
                        {pet.photoUrl ? (
                          <img src={pet.photoUrl} alt={`عکس ${pet.name}`} className="h-full w-full object-cover" />
                        ) : pet.species === "cat" ? (
                          <Cat className="h-6 w-6 text-primary" />
                        ) : (
                          <Dog className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{pet.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {pet.species === "cat" ? "گربه" : "سگ"}
                        </div>
                      </div>
                      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}

                  <button
                    onClick={() => navigate("/pets/add")}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed hover:border-primary text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>افزودن حیوان جدید</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">هنوز حیوانی اضافه نکرده‌اید</div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle className="text-xl">آمار سریع</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <>
                  <Skeleton className="h-8 w-48 mb-3" />
                  <Skeleton className="h-8 w-40 mb-3" />
                  <Skeleton className="h-8 w-56" />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">اسکن این ماه</div>
                    <div className="font-semibold">
                      <CountUp value={data.stats.totalScansThisMonth} /> <span>اسکن</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">غذای مورد علاقه</div>
                    <div className="font-semibold">
                      <CountUp value={data.stats.favoriteFoodsCount} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">میانگین امتیاز سلامت</div>
                    <div className="font-semibold">
                      <CountUp value={data.stats.averageHealthScore} /> / {toPersianDigits(10)}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                    <BarChart3 className="h-4 w-4" />
                    بروزرسانی آمار
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Row 4 - Activity */}
        <section aria-label="فعالیت‌های اخیر" className="mb-6">
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle className="text-xl">فعالیت‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !data ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-6 w-4/6" />
                </div>
              ) : data.recentActivity.length > 0 ? (
                <ul className="space-y-3">
                  {data.recentActivity.slice(0, 5).map((act) => (
                    <li key={act.id} className="flex items-start gap-3">
                      <div className="mt-1">{activityIcon(act.type)}</div>
                      <div className="flex-1">
                        <div className="text-sm">{act.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {toPersianDigits(new Date(act.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground">هنوز فعالیتی ثبت نشده است</div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
