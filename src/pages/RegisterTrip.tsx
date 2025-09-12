import { Header } from "@/components/Layout/Header";
import { TripRegistration } from "@/components/TripComponents/TripRegistration";

const RegisterTrip = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Register Your Trip</h1>
          <p className="text-xl text-muted-foreground">
            Get official permits and smart route recommendations
          </p>
        </div>
        <TripRegistration />
      </main>
    </div>
  );
};

export default RegisterTrip;