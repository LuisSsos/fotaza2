INSERT INTO usuarios (nombre_usuario, correo, contrasena, rol) VALUES
    ('admin', 'admin@fotaza2.com', '$2b$10$i3uVTvRc1ma0HrcyGArMlufn3c7rJTWsF1DGz.tk.tvVz0lvccsuu', 'admin'),
    ('validador', 'validador@fotaza2.com', '$2b$10$aLCzfBxhJc6bDztd2qpaGO/BfeyRoeo.yVkUAExXjnlDYKYbmSxr6', 'validador'),
    ('usuario_prueba', 'usuario@fotaza2.com', '$2b$10$HHsIk6AMNatybnSV28Pn9uizGdXiLdsngiRiJVwkf5RIHKJwuMdSW', 'comun');

INSERT INTO etiquetas (nombre) VALUES
    ('naturaleza'),
    ('ciudad'),
    ('retrato'),
    ('viajes'),
    ('arte');