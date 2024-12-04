﻿namespace CarLoan.Server.Models
{
    public class JWTSettings
    {
        public string Key { get; set; }

        public string Issuer { get; set; }

        public int TokenExpiry_Minutes { get; set; }
    }
}
