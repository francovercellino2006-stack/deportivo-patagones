-- ============================================================
-- Seed de ejemplo — Deportivo Patagones
--
-- PASO 1: Creá los usuarios en Supabase Auth Dashboard:
--   admin@dp.ar          / Admin1234!   (metadata: {"role":"admin","name":"Administración Club"})
--   demo.socio@dp.ar     / Demo1234!    (metadata: {"role":"socio","name":"Martín Rodríguez"})
--   demo.socio2@dp.ar    / Demo1234!    (metadata: {"role":"socio","name":"Florencia García"})
--   demo.socio3@dp.ar    / Demo1234!    (metadata: {"role":"socio","name":"Lucas Pérez"})
--   demo.socio4@dp.ar    / Demo1234!    (metadata: {"role":"socio","name":"Ana Martínez"})
--   demo.socio5@dp.ar    / Demo1234!    (metadata: {"role":"socio","name":"Carlos Romero"})
--   demo.profe@dp.ar     / Demo1234!    (metadata: {"role":"profe","name":"Diego Paredes"})
--
-- PASO 2: Una vez creados, reemplazá los UUIDs de abajo con los reales
--   (los encontrás en Authentication → Users en el dashboard de Supabase)
--
-- PASO 3: Ejecutá este SQL en el SQL Editor
-- ============================================================

-- Actualizá los perfiles (el trigger ya los crea, solo actualizamos los campos extra)
-- REEMPLAZÁ los UUIDs con los reales de tu proyecto:

-- Ejemplo (reemplazar UUIDs):
/*
update profiles set
  role = 'admin',
  name = 'Administración Club'
where id = 'UUID-DEL-ADMIN';

update profiles set
  socio_number = '1234',
  category = 'Socio Activo',
  sports = ARRAY['Fútbol', 'Básquet']
where id = 'UUID-DEL-SOCIO-1';

update profiles set
  socio_number = '1235',
  category = 'Socia Activa',
  sports = ARRAY['Hockey']
where id = 'UUID-DEL-SOCIO-2';

update profiles set
  socio_number = '1236',
  category = 'Socio Activo',
  sports = ARRAY['Básquet']
where id = 'UUID-DEL-SOCIO-3';

update profiles set
  socio_number = '1237',
  category = 'Socia Activa',
  sports = ARRAY['Patín']
where id = 'UUID-DEL-SOCIO-4';

update profiles set
  socio_number = '1238',
  category = 'Socio Activo',
  sports = ARRAY['Fútbol']
where id = 'UUID-DEL-SOCIO-5';

update profiles set
  profe_deporte = 'Fútbol',
  profe_initials = 'DP',
  profe_mock_id = 'profe-1'
where id = 'UUID-DEL-PROFE';

-- Cuotas del mes actual
insert into cuotas (socio_id, mes, monto, estado, vencimiento, deporte) values
  ('UUID-DEL-SOCIO-1', 'Junio 2026', 8500, 'pendiente', '2026-06-15', 'Fútbol'),
  ('UUID-DEL-SOCIO-1', 'Junio 2026', 8000, 'pendiente', '2026-06-15', 'Básquet'),
  ('UUID-DEL-SOCIO-2', 'Junio 2026', 8000, 'pagado',   '2026-06-15', 'Hockey'),
  ('UUID-DEL-SOCIO-3', 'Junio 2026', 8000, 'pendiente', '2026-06-15', 'Básquet'),
  ('UUID-DEL-SOCIO-4', 'Junio 2026', 7500, 'vencida',  '2026-06-10', 'Patín'),
  ('UUID-DEL-SOCIO-5', 'Junio 2026', 8500, 'pagado',   '2026-06-15', 'Fútbol');
*/
