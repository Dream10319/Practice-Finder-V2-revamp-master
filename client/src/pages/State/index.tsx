import React from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { setKey, setLanguage, setRegion, fromAddress } from "react-geocode";
import { useParams } from "react-router-dom";
import { apis } from "@/apis";
import geoJsonData from "@/assets/json/us-state-boundaries.json";
import { ICoordinate } from "@/types";

const containerStyle = {
  width: "100%",
  minHeight: "500px",
  maxHeight: "600px",
};

setKey(import.meta.env.VITE_GOOGLE_MAP_API_KEY || "");
setLanguage("en");
setRegion("es");

const StatePage = () => {
  const { state } = useParams();
  const [count, setCount] = React.useState("");
  const [areas, setAreas] = React.useState<Array<any>>([]);
  const [center, setCenter] = React.useState<any>(null);
  const [statedescription, setDescription] = React.useState<Array<any>>([]);

  const GetCountryBorders = (state: string) => {
    let borders: Array<Array<ICoordinate>> = [];
    const countryFeature = geoJsonData.find(
      (feature: any) => feature.name.toLowerCase() === state.toLowerCase()
    );

    if (!countryFeature) {
      return [];
    }

    if (countryFeature.st_asgeojson.geometry.type === "Polygon") {
      borders = [
        countryFeature.st_asgeojson.geometry.coordinates[0].map(
          (coord: any) => ({
            lat: coord[1],
            lng: coord[0],
          })
        ),
      ];
    } else if (countryFeature.st_asgeojson.geometry.type === "MultiPolygon") {
      borders = countryFeature.st_asgeojson.geometry.coordinates
        .map((polygon: any) =>
          polygon.map((ring: number[][]) =>
            ring.map((coord: any) => ({
              lat: coord[1],
              lng: coord[0],
            }))
          )
        )
        .flat();
    }
    return borders;
  };

  const GetStateCount = async (st: string) => {
    try {
      const response: any = await apis.getStateListingsCount({ state: st });
      if (response.status) {
        setCount(String(response.payload.count));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetLocalAreas = async (st: string) => {
    try {
      const response: any = await apis.getLocalAreas({ state: st });
      if (response.status) {
        setAreas(response.payload.areas);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetGeoCode = async (st: string) => {
    try {
      fromAddress(`${st}, USA`)
        .then(({ results }) => {
          const { lat, lng } = results[0].geometry.location;
          setCenter({ lat, lng });
        })
        .catch(console.error);
    } catch (err) {
      console.log(err);
    }
  };

  const GetDescription = async (st: string) => {
    try {
      const response: any = await apis.getStateDescription({ state: st });
      if (response.status) {
        setDescription(response.payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (state) {
      GetStateCount(state);
      GetLocalAreas(state);
      GetGeoCode(state);
      GetDescription(state);
    }
  }, [state]);

  return (
    <div>
      <div className="max-w-[1440px] mx-auto py-10 max-[480px]:py-5">
        <h1 className="text-5xl text-primary font-extrabold max-[480px]:text-2xl max-[480px]:px-2 text-center">
          Dental Practices For Sale in {state}
        </h1>
      </div>
      <div className="bg-primary">
        <div className="max-w-[1440px] mx-auto px-10 py-15 max-[480px]:px-5">
          <div className="grid grid-cols-2 m gap-10 max-[768px]:grid-cols-1">
            <div className="my-auto">
              {center ? (
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                >
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={5}
                  >
                    {GetCountryBorders(state as string).length > 0 ? (
                      <Polygon
                        paths={GetCountryBorders(state as string)}
                        options={{
                          fillColor: "rgba(0,0,0,0.9)",
                          strokeColor: "rgba(0,0,0)",
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                      />
                    ) : null}
                  </GoogleMap>
                </LoadScript>
              ) : null}
            </div>
            <div className="max-w-[650px] w-full shadow-2xl rounded-2xl bg-white p-10 flex flex-col gap-5 max-[480px]:px-5">
              <h1 className="text-4xl font-bold text-center max-[480px]:text-3xl">
                {state}
              </h1>
              <h2 className="text-6xl font-bold text-center max-[480px]:text-5xl">
                {count}
              </h2>
              <div className="text-lg flex flex-col gap-2 px-6 max-[480px]:text-sm max-[480px]:px-1">
                {statedescription.length > 0 ? (
                  <>
                    <p>{statedescription[0].description}</p>

                    {/* Professional Associations Section */}
                    {statedescription[0].association?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-3 text-xl">State Dental Association:</h3>
                        <ul className="space-y-6">
                          {statedescription[0].association.map((assoc: any) => (
                            <li key={assoc._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                              {/* Association Name and Website */}
                              <div className="flex items-start mb-2">
                                <span className="mr-2 text-primary">•</span>
                                <div>
                                  <li key={assoc._id}>
                                    <a
                                      href={assoc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {assoc.name}
                                    </a>
                                  </li>
                                </div>
                              </div>

                              {/* Contact Information Grid */}
                              <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {/* Location */}
                                {assoc.location && (
                                  <div className="flex items-start">
                                    <span className="mr-2 text-gray-500">📍</span>
                                    <span>{assoc.location}</span>
                                  </div>
                                )}

                                {/* Phone */}
                                {assoc.phone && (
                                  <div className="flex items-start">
                                    <span className="mr-2 text-gray-500">📞</span>
                                    <a
                                      href={`tel:${assoc.phone.replace(/\D/g, '')}`}
                                      className="hover:underline"
                                    >
                                      {assoc.phone}
                                    </a>
                                  </div>
                                )}

                                {/* Email */}
                                {assoc.email && (
                                  <div className="flex items-start">
                                    <span className="mr-2 text-gray-500">✉️</span>
                                    <a
                                      href={`mailto:${assoc.email}`}
                                      className="text-blue-600 hover:underline break-all"
                                    >
                                      {assoc.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Loading description...</p>
                )}
              </div>
              <a
                className="bg-[#FF7575] py-2 px-10 w-fit text-white mx-auto rounded-full text-base font-semibold cursor-pointer hover:opacity-80"
                href="/signup"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F1F1F1] p-10">
        <div className="max-w-[1440px] mx-auto w-full">
          <h1 className="text-4xl font-extrabold text-primary max-[480px]:text-xl">
            Local Listings of Practices For Sale
          </h1>
          <div className="grid min-[1024px]:grid-cols-5 min-[768px]:grid-cols-3 grid-cols-2 gap-1 mt-5">
            {areas.map((area: any) => (
              <div
                key={area}
                className="text-lg font-medium max-[480px]:text-sm"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatePage;
