--queries 1
INSERT INTO public.account (
account_firstname, account_lastname, account_email, account_password)
Values(
'Tony','Stark','tony@starkent.com','Iam1ronM@n'
)

--queries 2
UPDATE public.account SET account_type = 'Admin'
where account_id = '1'

--queries 3
DELETE FROM public.account where account_id = '1'

--queries 4
UPDATE
  public.inventory
SET
  inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE
  inv_id = '10';

--queries 5
select inv_make, inv_model 
from public.inventory i
inner join public.classification c ON c.classification_id = i.classification_id
where classification_name = 'Sport'  

--queries 6
UPDATE
  public.inventory
SET
  inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')
  