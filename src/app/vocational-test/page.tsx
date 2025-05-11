"use client";

import SolarSystem from "../components/SolarSystem";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

export default function VocationalTest() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    // Intentar obtener datos del usuario autenticado primero
    if (user) {
      setUserName(user.name || "");

      // Si hay datos de ubicación en el perfil del usuario
      const region = user.profileData?.location?.region;
      const province = user.profileData?.location?.province;

      if (region && province) {
        setUserLocation(`${province}, ${region}`);
      } else if (region) {
        setUserLocation(region);
      } else if (province) {
        setUserLocation(province);
      }
    } else {
      // Fallback a localStorage si no hay usuario autenticado
      setUserName(localStorage.getItem("userName") || "");
      setUserLocation(localStorage.getItem("userLocation") || "");
    }
  }, [user]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/assets/img/tests/bg-tests.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <SolarSystem />
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 55,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 5,
          }}
        >
          {userName}
        </h1>
        <div style={{ color: "#A8F3E5", fontWeight: 500, fontSize: 18 }}>
          <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 8 }} />{" "}
          {userLocation}
        </div>
      </div>
    </div>
  );
}
