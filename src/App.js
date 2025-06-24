
import React, { useState, useEffect } from "react";
// We are removing all QR code library dependencies (npm package and script tag)
// to avoid environment and loading issues. We will use a public API instead.
import {
  QrCode,
  User,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Share2,
  Download,
  Copy,
  Check,
  Building,
  Linkedin,
  Twitter,
  Github,
  MapPin,
  Home,
} from "lucide-react";

// --- Re-usable UI Components ---
const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {React.cloneElement(icon, { size: 20, className: "text-gray-400" })}
    </div>
    <input
      {...props}
      className="block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
);
const TextAreaField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
      {React.cloneElement(icon, { size: 20, className: "text-gray-400" })}
    </div>
    <textarea
      {...props}
      rows="3"
      className="block w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
);

// --- Display Component for the Profile Card ---
const BusinessCard = ({ data }) => {
  const { accentColor } = data;
  const cleanUrl = window.location.origin + window.location.pathname;

  const createVCardFile = () => {
    let vCardParts = ["BEGIN:VCARD", "VERSION:3.0"];
    if (data.name && data.name !== "N/A") vCardParts.push(`FN:${data.name}`);
    if (data.name && data.name !== "N/A") vCardParts.push(`N:${data.name};;;;`);
    if (data.company && data.company !== "N/A")
      vCardParts.push(`ORG:${data.company}`);
    if (data.title && data.title !== "N/A")
      vCardParts.push(`TITLE:${data.title}`);
    if (data.phoneWork && data.phoneWork !== "N/A")
      vCardParts.push(`TEL;TYPE=WORK,VOICE:${data.phoneWork}`);
    if (data.phonePersonal && data.phonePersonal !== "N/A")
      vCardParts.push(`TEL;TYPE=HOME,VOICE:${data.phonePersonal}`);
    if (data.emailWork && data.emailWork !== "N/A")
      vCardParts.push(`EMAIL;TYPE=WORK:${data.emailWork}`);
    if (data.emailPersonal && data.emailPersonal !== "N/A")
      vCardParts.push(`EMAIL;TYPE=HOME:${data.emailPersonal}`);
    if (data.address && data.address !== "N/A")
      vCardParts.push(`ADR;TYPE=WORK:;;${data.address.replace(/\n/g, " ")}`);
    if (data.website && data.website !== "N/A")
      vCardParts.push(`URL:${data.website}`);
    if (data.linkedin && data.linkedin !== "N/A")
      vCardParts.push(`X-SOCIALPROFILE;TYPE=linkedin:${data.linkedin}`);
    if (data.twitter && data.twitter !== "N/A")
      vCardParts.push(`X-SOCIALPROFILE;TYPE=twitter:${data.twitter}`);
    if (data.github && data.github !== "N/A")
      vCardParts.push(`X-SOCIALPROFILE;TYPE=github:${data.github}`);
    vCardParts.push("END:VCARD");

    const vCardData = vCardParts.join("\n");
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const vCardUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = vCardUrl;
    const safeName = (data.name || "contact")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    link.download = `${safeName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(vCardUrl);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div
          style={{ backgroundColor: accentColor }}
          className="h-32 flex items-center justify-center relative"
        >
          <div
            className="absolute -bottom-14 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg border-4"
            style={{ borderColor: accentColor }}
          >
            <User size={56} style={{ color: accentColor }} />
          </div>
        </div>
        <div className="pt-20 p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {data.name !== "N/A" ? data.name : ""}
          </h1>
          <p className="text-lg font-medium text-gray-600 mt-1">
            {data.title !== "N/A" ? data.title : ""}
          </p>
          <p className="text-md text-gray-500 mt-1">
            {data.company !== "N/A" ? data.company : ""}
          </p>
          <div className="mt-6 space-y-4 text-left">
            {data.phoneWork && data.phoneWork !== "N/A" && (
              <a
                href={`tel:${data.phoneWork}`}
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Phone
                  size={20}
                  className="mr-4 flex-shrink-0"
                  style={{ color: accentColor }}
                />{" "}
                <span>
                  {data.phoneWork}{" "}
                  <span className="text-xs text-gray-400">(Work)</span>
                </span>
              </a>
            )}
            {data.phonePersonal && data.phonePersonal !== "N/A" && (
              <a
                href={`tel:${data.phonePersonal}`}
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Home
                  size={20}
                  className="mr-4 flex-shrink-0"
                  style={{ color: accentColor }}
                />{" "}
                <span>
                  {data.phonePersonal}{" "}
                  <span className="text-xs text-gray-400">(Personal)</span>
                </span>
              </a>
            )}
            {data.emailWork && data.emailWork !== "N/A" && (
              <a
                href={`mailto:${data.emailWork}`}
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Mail
                  size={20}
                  className="mr-4 flex-shrink-0"
                  style={{ color: accentColor }}
                />{" "}
                <span>
                  {data.emailWork}{" "}
                  <span className="text-xs text-gray-400">(Work)</span>
                </span>
              </a>
            )}
            {data.emailPersonal && data.emailPersonal !== "N/A" && (
              <a
                href={`mailto:${data.emailPersonal}`}
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <Mail
                  size={20}
                  className="mr-4 flex-shrink-0"
                  style={{ color: accentColor }}
                />{" "}
                <span>
                  {data.emailPersonal}{" "}
                  <span className="text-xs text-gray-400">(Personal)</span>
                </span>
              </a>
            )}
            {data.address && data.address !== "N/A" && (
              <div className="flex items-start text-gray-700">
                <MapPin
                  size={20}
                  className="mr-4 mt-1 flex-shrink-0"
                  style={{ color: accentColor }}
                />
                <pre className="whitespace-pre-wrap font-sans">
                  {data.address}
                </pre>
              </div>
            )}
            <div className="pt-4 mt-4 border-t">
              {data.website && data.website !== "N/A" && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 mb-3"
                >
                  <Globe
                    size={20}
                    className="mr-4 flex-shrink-0"
                    style={{ color: accentColor }}
                  />{" "}
                  <span>{data.website}</span>
                </a>
              )}
              {data.linkedin && data.linkedin !== "N/A" && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 mb-3"
                >
                  <Linkedin
                    size={20}
                    className="mr-4 flex-shrink-0"
                    style={{ color: accentColor }}
                  />{" "}
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {data.twitter && data.twitter !== "N/A" && (
                <a
                  href={data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600 mb-3"
                >
                  <Twitter
                    size={20}
                    className="mr-4 flex-shrink-0"
                    style={{ color: accentColor }}
                  />{" "}
                  <span>Twitter / X Profile</span>
                </a>
              )}
              {data.github && data.github !== "N/A" && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <Github
                    size={20}
                    className="mr-4 flex-shrink-0"
                    style={{ color: accentColor }}
                  />{" "}
                  <span>GitHub Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <button
            onClick={createVCardFile}
            className="w-full text-center text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center text-lg"
            style={{ backgroundColor: accentColor }}
          >
            <Download size={20} className="mr-2" /> Save to Contacts
          </button>
        </div>
      </div>
      <div className="mt-8 text-center">
        <a
          href={cleanUrl}
          className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-500 font-semibold transition-colors"
        >
          <QrCode size={16} className="mr-2" /> Create Your Own Digital Card
        </a>
      </div>
    </div>
  );
};

// --- Component for the Creation Form ---
const CreationForm = ({
  formData,
  handleInputChange,
  createProfileCard,
  generatedUrl,
  isCopied,
  copyUrl,
  qrCodeImageUrl,
}) => {
  const downloadQRCode = async () => {
    if (!qrCodeImageUrl) return;
    try {
      // Fetch the image from the API as a blob
      const response = await fetch(qrCodeImageUrl);
      const blob = await response.blob();
      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "profile-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Could not download QR code:", error);
      // Fallback for when fetching fails (e.g., due to CORS)
      window.open(qrCodeImageUrl, "_blank");
    }a
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create Your Digital Profile
          </h1>
          <form onSubmit={createProfileCard}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <InputField
                    icon={<User />}
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    icon={<Briefcase />}
                    name="title"
                    placeholder="Designation / Title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Building />}
                    name="company"
                    placeholder="Company / Organization"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                  Contact Details
                </h3>
                <div className="space-y-4">
                  <InputField
                    icon={<Phone />}
                    name="phoneWork"
                    type="tel"
                    placeholder="Work Phone"
                    value={formData.phoneWork}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Home />}
                    name="phonePersonal"
                    type="tel"
                    placeholder="Personal Phone"
                    value={formData.phonePersonal}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Mail />}
                    name="emailWork"
                    type="email"
                    placeholder="Work Email"
                    value={formData.emailWork}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Mail />}
                    name="emailPersonal"
                    type="email"
                    placeholder="Personal Email"
                    value={formData.emailPersonal}
                    onChange={handleInputChange}
                  />
                  <TextAreaField
                    icon={<MapPin />}
                    name="address"
                    placeholder="Physical Address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                  Web & Social Links
                </h3>
                <div className="space-y-4">
                  <InputField
                    icon={<Globe />}
                    name="website"
                    type="url"
                    placeholder="Main Website URL"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Linkedin />}
                    name="linkedin"
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Twitter />}
                    name="twitter"
                    type="url"
                    placeholder="Twitter / X Profile URL"
                    value={formData.twitter}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Github />}
                    name="github"
                    type="url"
                    placeholder="GitHub Profile URL"
                    value={formData.github}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex items-center pt-2">
                <label
                  htmlFor="accentColor"
                  className="text-sm font-medium text-gray-700 mr-4"
                >
                  Accent Color
                </label>
                <input
                  type="color"
                  id="accentColor"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleInputChange}
                  className="h-10 w-10 rounded-md border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center text-lg shadow-md hover:shadow-lg"
            >
              <QrCode size={22} className="mr-2" />
              Generate QR Code
            </button>
          </form>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
          {generatedUrl ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Profile is Ready!
              </h2>
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-inner">
                {qrCodeImageUrl ? (
                  <img
                    src={qrCodeImageUrl}
                    alt="Generated QR Code"
                    width="256"
                    height="256"
                  />
                ) : (
                  <div className="w-[256px] h-[256px] flex items-center justify-center">
                    <p>Generating QR code...</p>
                  </div>
                )}
              </div>
              <div className="w-full max-w-xs mt-6">
                <div className="relative flex items-center mb-4">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="w-full bg-gray-100 border rounded-lg py-2 px-3 text-sm truncate pr-10"
                  />
                  <button
                    onClick={copyUrl}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md"
                  >
                    {isCopied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadQRCode}
                    className="w-1/2 bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 flex items-center justify-center"
                  >
                    <Download size={18} className="mr-2" /> QR
                  </button>
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center"
                  >
                    <Share2 size={18} className="mr-2" /> Preview
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <QrCode size={80} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-xl font-semibold text-gray-700">
                Your profile QR code will appear here.
              </h2>
              <p className="mt-2">Fill out the form to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState("form");
  const [cardData, setCardData] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState("");

  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem(
        "comprehensive-profile-data-no-firebase"
      );
      return savedData
        ? JSON.parse(savedData)
        : {
            name: "",
            title: "",
            company: "",
            phoneWork: "",
            phonePersonal: "",
            emailWork: "",
            emailPersonal: "",
            website: "",
            address: "",
            linkedin: "",
            twitter: "",
            github: "",
            accentColor: "#4f46e5",
          };
    } catch (error) {
      return {
        name: "",
        title: "",
        company: "",
        phoneWork: "",
        phonePersonal: "",
        emailWork: "",
        emailPersonal: "",
        website: "",
        address: "",
        linkedin: "",
        twitter: "",
        github: "",
        accentColor: "#4f46e5",
      };
    }
  });

  // Check URL on load to see if we need to display a card
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get("data");
    if (data) {
      try {
        const decodedData = JSON.parse(atob(data));
        setCardData(decodedData);
        setView("card");
      } catch (error) {
        setView("form");
      }
    }
  }, []);

  // Persist form data whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "comprehensive-profile-data-no-firebase",
      JSON.stringify(formData)
    );
  }, [formData]);

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // This function now handles everything in one go.
  const createProfileCard = (e) => {
    e.preventDefault();
    setQrCodeImageUrl(""); // Clear old QR code

    const dataForQr = {};
    for (const key in formData) {
      dataForQr[key] = formData[key] || "N/A";
    }

    const url = `${window.location.origin}${
      window.location.pathname
    }?data=${btoa(JSON.stringify(dataForQr))}`;
    setGeneratedUrl(url);

    // Use the public API to generate the QR code image URL
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
      url
    )}`;
    setQrCodeImageUrl(qrApiUrl);
  };

  const copyUrl = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedUrl;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
    document.body.removeChild(textArea);
  };

  if (view === "card" && cardData) {
    return <BusinessCard data={cardData} />;
  }

  return (
    <CreationForm
      formData={formData}
      handleInputChange={handleInputChange}
      createProfileCard={createProfileCard}
      generatedUrl={generatedUrl}
      isCopied={isCopied}
      copyUrl={copyUrl}
      qrCodeImageUrl={qrCodeImageUrl}
    />
  );
}
