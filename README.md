
# SSO Project

## Giriş
Bu proje Patika AloTech bootcamp kapsamında final ödevi olarak verilmiştir.

Proje üç front-end (login, sso-consumer, user-manager) ve iki back-end'den 
(user-api, sso-auth)
oluşmaktadır.

Proje Ataberk Tümay, Ayça Ataşer, Semih Durgun ve Oğuzhan Çevik grubu tarafından hazırlanmıştır.

## Kurulum ve Konfigürasyon

Projeyi bilgisayarınıza klonlayın.

Bilgisayarınızda eğer yoksa mysql ve mysql workbench kurulumunu gerçekleştirin.
"users" adında bir database oluşturup, repo'muzda bulunan ddl dosyasını kullanarak tablo ve stored
procedures oluşturun.

Visual Code veya tercih ettiğiniz bir ide'yi kullanarak projeyi açın. Projeyi
açtıktan sonra ilk olarak sso-auth/api/.env dosyasına giriş yapıp DB_USER, DB_PASS ve 
DB_DATABASE bilgilerini kendi kullanıcı adı, şifre ve database adınızla güncelleyin.

Aynı işlemleri user-manager/api/config.json dosyası için de gerçekleştirin.

Database bilgilerini doğru bir şekilde girdiğinize emin olduktan sonra tüm projelerin 
kurulumuna geçebilirsiniz.

sso-auth dosyası için api ve client dosyaları içinde ayrı ayrı "npm install" komutunu terminali kullanarak çalıştırın.
Bu aşamalarda ide'nize dahil olan terminal varsa onu da kullanabilirsiniz.

sso-consumer içerisinde gene "npm install" komutunu çalıştırın.

user-manager dosyası içinde de api ve client dosyaları için ayrı ayrı "npm install" komutunu çalıştırın.

Uygulamaları başlatmadan önce portların aşağıdaki gibi olduğuna emin olun.

```
sso-auth/client = 3000
ssso-auth/api = 3001
user-manager/api = 4000
user-manager/client = 3020
sso-consumer = 3010
```


Bu portlar default şekilde ayarlanmıştır. Kontrol etmek için tüm klasörlerin
.env dosyalarını, user-manager/api için de app.js dosyasını kontrol edebilirisiniz.

Bu aşamadan sonra sırayla sso-auth/api, sso-auth/client, user-manager/api,
user-manager/client ve sso-consumer dosyalarını "npm start" komutuyla çalıştırabilirsiniz.

UYARI! Eger bir hata alıyorsanız veya localhost:3020 veya localhost:3010 sitelerine girdiginizde
herhangibir işlem gerçekleşmiyorsa adblock'unuzu kapatmayı veya gizli modda açmayı deneyiniz.

Her şey başarılı bir şekilde gerçekleştiyse localhost:3000 sayfası direkt girildiginde beyaz ekran vermeli.
localhost:3020 ve localhost:3010 sizi login sayfasına yönlendirmelidir.

Şu an bir admin hesabınız olmadıgından mysql workbench kullanarak

```
`insert into users
(username,user_name,user_surname,user_password,user_email, user_type,createdAt,updatedAt)
 VALUES
('admin','name', 'surname', '$2a$10$A3Yoyj3T.xt2DuKaKQ2qgeLsnL3.H12VztcQirbS2zqhGS87pA5/q', 'test@test.com','admin', '2021-12-26 01:48:41', '2021-12-26 01:48:41')`
```

Bu komutu girerseniz size kullanıcı adı admin, şifresi pass123 olan bir admin hesabı üretecektir.

Bu hesapla giriş yapabilirsiniz.

## Kullanım
