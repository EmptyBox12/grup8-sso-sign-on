
# SSO Project

## Giriş
Bu proje Patika AloTech bootcamp kapsamında final ödevi olarak verilmiştir.

Proje üç front-end (login, sso-consumer, user-manager) ve iki back-end'den 
(user-api, sso-auth)
oluşmaktadır.

Proje Ataberk Tümay, Ayça Ataşer, Semih Durgun ve Oğuzhan Çevik grubu tarafından hazırlanmıştır.

Projede amaç SSO mantığına uygun yani bir siteye giriş yapıldığında yetki ve diğer bazı kriterler sağlanıyorsa
tekrar login olmadan giriş yapabildiğimiz, authorization ve login işlemlerinin tek yerden kontrol edildiği bir proje yapmaktır.

Front-end: React.js
Back-end: Node.js, Express.js
Database: Mysql

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
('adminDefault','name', 'surname', '$2a$10$ZvEsJTw7rOTZz8OWYzSeIesn8vGIBCdWhGaVO5LBc02l5wzKMZtY6', 'test@test.com','admin', '2021-12-26 01:48:41', '2021-12-26 01:48:41')`
```

Bu komutu girerseniz size kullanıcı adı adminDefault, şifresi pass123 olan bir admin hesabı üretecektir.

Bu hesapla giriş yapabilirsiniz.

## Kullanım

Kurulumu başarıyla gerçekleştirdiyseniz user-manager ve sso-consumer sitelerine erişim yapmaya
çalışabilirsiniz.

Login sayfası yani localhost:3000 sayfası hiçbir query olmadan çalışmayacak şekilde dizayn edilmiştir.

### SSO-Consumer / localhost:3010

Bu sayfa hem user kullanıcının hem de adminin giriş yapabildiği, kendi bilgilerini görebildikleri basit bir sayfadır.

Bu sayfaya giriş isteğinde bulunduğunuzda eğer 
cookie'lerinizde var olan bir accessToken yoksa sizi login sayfasına yönlendirecektir. 

Login sayfasından admin veya user hesabıyla doğru bir giriş yaptığınızda sizi otomatik olarak
sso-consumer sayfasına yönlendirecektir ve bilgilerinizi ekrana yansıtacaktır.

Eğer browser'ınızda hali hazırda accessToken içeren bir cookie varsa sso-auth servisinin isTokenValid endpoint'ine 
ip'nizi, bulunduğunuz siteyi ve accessToken'ı içeren bir istek atacaktır. Token'nunuz belirli kontrollerden geçicektir.

```
> Token database içerisinde bulunuyor mu?
> Token'nın eşleştiği ip ile istekten gelen ip aynı mı?
> Token'nın bu siteye erişimi var mı?
> Token'nın süresi bitmiş mi?
```
Eğer bu denetimlerden başarılı bir şekilde geçerse token'nın süresi uzatılır ve userID ile token kullanıcıya geri döndürülür.

User bilgileri http://localhost:4000/users/${id}/?url=localhost:3010 adresine, headers içerisinde ip ve accessToken konularak get isteği atılır.

Bu istek atıldığnda user-manager/api tekrar kendi içinden sso-auth'a verifyToken isteği atarak ordan gelen cevaba göre kullanıcı bilgilerini geri döner. Veya kullanıcı tekrar logine yönlendirilir.

### User-Manager/Client / localhost:3020

Bu sayfa sadece admin kullanıcısının giriş yapabildiği ve sistemde bulunan tüm kullancıları görebildiği, silebildiği, güncelleyebildiği ve yeni bir kullanıcı oluşturabildiği
bir admin paneli sayfasıdır.

Bu sayfaya giriş yaparken ki işlemler sso-consumer'a benzerdir. 
Eğer bu sayfadan login sayfasına yönlendirildiysek ekstra olarak login aşamasında kullanıcının admin olup olmadığı da kontrol edilecektir.

AccessToken cookie'de bulunuyorsa sso-consumer'da bulunan işlemlerden geçip
verify olup olmadığı kontrol edilir.

Bu sayfada admin user-manager/api (localhost:4000) api'sına istek atarak
silme, oluşturma, listeleme ve güncelleme işlemleri yapar.

```
getUsers = axios.get(http://localhost:4000/users/?url=http://localhost:3020`, {
        headers: { authorization: `Bearer ${cookies.accessToken}`, ip: userIP },

deleteUser = await axios.delete( http://localhost:4000/users/${id}/?url=http://localhost:3020`,
        { headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP}}

updateUser =  await axios.put( http://localhost:4000/users/?url=http://localhost:3020`,
        {
          username: values.username,
          user_name: values.user_name,
          user_surname: values.user_surname,
          user_password: values.user_password,
          user_email: values.user_email,
          user_type: values.user_type,
        },
        { headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP} }
      );   

 createUser = await axios.post( http://localhost:4000/users/?url=http://localhost:3020`,
        {
          username: values.username,
          user_name: values.user_name,
          user_surname: values.user_surname,
          user_password: values.user_password,
          user_email: values.user_email,
          user_type: values.user_type,
        },
        { headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP} }
      );        

```
Bu isteklerden user-manager/api kısmında tekrar bahsedilecektir. Gönderilen ip adresi 
http://api.ipify.org/?format=json adresine istek atarak alınmaktadır.

Bu sayfaya başarılı giriş yapan bir kişi. SSO-consumer sitesine giriş yaparken tekrar login olmasına gerek olmayacaktır.

### SSO-Auth/Api /localhost:3001

Bu back-end sistemdeki tüm servislerin authorization ve authentication
işlemlerinin gerçekleştiği ortak alandır. İki tane end-point'e sahiptir.

```
login = http://localhost:3001/isAuthorized/?redirectURL=http://localhost:****/
 { username: username, password: hashedPass },
        {
          headers: {
            ip: userIP,
          }
verifyToken = http://localhost:3001/verifyToken/?url=http://localhost:****/
    {
                token: cookies.accessToken,
              },
              {
                headers: {
                  ip: userIP,
                },
```
isAuthorized end-point'ine client'dan alınan ip, kullanıcı adı ve şifreyle istek atılır ve 
bu bilgiler belirli kontrollerden geçer.
```
username database'de var mı?
istek user-manager/client'dan geliyorsa user_type admin mi
şifre databasedeki şifreyle uyuşuyor mu?
```
Bu işlemlerin sonucunda olumsuz sonuç alınırsa
```
res.status(400).json({ status: "fail", msg: "username not found" });
res.status(400).json({ status: "fail", msg: "not admin" });
re..status(400).json({ status: "fail", msg: "password doesn't match" });
```
Olumlu sonuç alınırsa ise ip adresi, token'nın erişebileceği url adresleri, 
bitiş tarihi, token'ı oluştarın user'ın id'si ve tokenın kendisi veritabanına kaydedilir.
```
 res.status(200).json({
            status: "success",
            msg: "logged in",
            authorization: true,
            user_id: userId,
            accessToken: accessToken,
            expireDate: dataDate,
          });
```
verifyToken end-point'i ise sso-consumer kısmında bahsedilen kontrolleri yapan 
ve olumsuz sonuç gerçekleştirdiyseniz
```
res.status(400).json({ status: "fail", msg: "token not found" });
res.status(400).json({ status: "fail", msg: "you don't have permission" });
res.status(400).json({ status: "fail", msg: "Token expired" });
```
Olumlu sonuçta ise token'nın bitiş tarihi şu andan itibaren 3 saat uzatılarak
```
  res.status(200).json({
                    status: "success",
                    msg: "token is valid",
                    token,
                    userId,
                  });
```
Şeklinde dönüş yapmaktadır.
### SSO-Auth/Client /localhost:3000
Bu sayfa login sayfası olup query olmadan giriş yapılmamaktadır. Kullanıcı bu sayfaya
direkt olarak ulaşmamalı, sadece yönlendirmelerle ulaşması gerekmektedir.

Eğer cookie'ler accessToken varken bu siteye doğru bir url yapısıyla ulaşmaya çalışılınırsa
sso-auth/api servisinin verifyToken end-pointine istek atarak token geçerliliğini kontrol eder 
ve sizi ilgili siteye yönlendirir.

Tokenın geçerli olmadığı durumlarda size login işlemi yaptırır ve ip'niz,
username'iniz ve sha256 formatında salt'la beraber hashlenmiş şifrenizle beraber
isAuthorized end-pointine istek atak. Oradan gelecek sonucak göre cookie'lere güncel token'ı
set ederek sizi geri gönderir.
```
http://localhost:3000/?redirectURL=http://localhost:****/
```
### User-Manager/Api /localhost:4000
Bu servise istek atarak yetkili bir kullanıcı kullanıcıları görüntüleme,
silme, güncelleme, oluşturma ve bir kullanıcının bilgilerini göre işlemlerini gerçekleştirebilir.

```
getAll = http://localhost:4000/users/?url=http://localhost:****`, {
        headers: { authorization: `Bearer ${cookies.accessToken}`, ip: userIP }
getById =  http://localhost:4000/users/${id}/?url=localhost:*** , {
        headers: { authorization: `Bearer ${cookies.accessToken}`, ip: userIP }
create = http://localhost:4000/users/?url=http://localhost:****`,
        {
          username: values.username,
          user_name: values.user_name,
          user_surname: values.user_surname,
          user_password: values.user_password,
          user_email: values.user_email,
          user_type: values.user_type,
        },
        { headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP} }
      );        
update = http://localhost:4000/users/?url=http://localhost:***`,
        {
          username: values.username,
          user_name: values.user_name,
          user_surname: values.user_surname,
          user_password: values.user_password,
          user_email: values.user_email,
          user_type: values.user_type,
        },
        { headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP} }
      );   
delete =  http://localhost:4000/users/${id}/?url=http://localhost:***`,
        { headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP}}
```
Bu isteklerden dönen olumlu veya olumsuz sonuçlara göre belirtilen işlemler yapılır.

İsteklerde token ve ip headers içerisinde, isteği atan url ise query içerisinde yollanmaktadır.
Atılan istek bu isteklere ulaşmadan önce auth middleware'inden geçmektedir. Bu middleware sso-auth/api
servisinin verifyToken end-pointine gerekli bilgilerle istek atarak token'nın geçerliliğini ve yetkisini
her aşamada kontrol eder. Bu middleware'den 
```
 res.status(400).json({status: "token fail", msg: "Invalid token"});
```
şeklinde bir geri dönüş alınırsa, kişi tekrar login sayfasına yönlendirilir.
## Proje Analizi
Projenin ilk ulaştığı akşam müsait olan takım arkadaşları toplanmış ve proje hakkında bir ön konuşma yapmıştır.
Sonra bir kaç saat ara verilmiştir ve herkes verilen pdf'den istenilen projeyi daha iyi anlamaya çalışıp tekrar toplanmıştır.
İlk akşam bir ön analiz yapılıp, proje ne şekilde yapılabilir diye fikirler ortaya atılmıştır. Token sistemi olarak 
JWT kullanımı düşünülmüştür ve kaç tane back-end, kaç tane front-end bulanacağı ve bunların ilişkileri tartışılmıştır.

İkinci günkü toplantıda ayrı araştırmalardan da sonra JWT token'ı yerine bizden özel bir token sistemi üretmemiz istendiği düşünülmüştür.
Database'in hangi tablolardan oluşacağı ve isimlendirmeler ne şekilde olacak konuşulmuştur.
```
token
id - user_id - token - expire_date - url - ip

users
id - username - user_name - user_surname - user_password - user_email - user_type - createdAt - updatedAt

logs
id - LOG - LEVEL
```
Bu aşamada hala sitelerin nasıl cookie paylaşacağı, ip kontrolü nasıl sağlanacak gibi 
konularda hala tam kesinleşmemiş olsak da projenin genel işleyişini kavramış olduk. Genel işleyişe şu şekilde karar verdik.

Kullanıcı sso-consumer veya user-manager/client sayfalarına giriş yapmak istediğinde ilk önce sitenin cookie'si kontrol edilir.
Eğer cookie'lerde accessToken bulunuyorsa sso-auth servisine istek atılır ve accessToken verify işlemi gerçekleşir. Eğer sıkıntı yoksa 
kişi siteye giriş yapıp işlemlerine devam eder. User-manager/api'a yapılan her istekte tekrar verifyToken kontrolü yapılır.
Eğer accessToken bulunmuyorsa veya valid değilse bu kişi login sayfasına aktarılır. Bu sayfada başarıyla login olursa accessToken üretilip verilir ve 
kullanıcı işlemlerine devam eder.

Sistemi bu şekilde düşünüp, kesinleştiremediğimiz yerleri araştırmaya devam ederken verifyToken end-point'i ve user-manager/api crud işlemleri
kısımlarına başladık.

Çalışmalarımız sırasında localhost'ların cookie paylaştığını öğrenince sistemi tam olarak kurmuş olduk. 
Bu aşamadan sonra çalışmalarımız daha çok hızlandı ve konuşmalarımız daha çok yazılı olarak telegramdan gerçekleşti.
Discord'da düzenli toplantılar ve ihtiyaç olduğunda ekran paylaşıp yardımlaşmalar yaptık.
## Tasarım

![şema](https://i.imgur.com/6qC6RkC.png)

Tasarım şekilde görüldüğü gibi çizilmiştir. Şekil karışık dursa da bunun üzerine tartışılıp konuşulduğundan anlaşılmada sorun olmamıştır.

Önceden de belirtildiği gibi proje üç front-end ve iki back-end'den oluşacak şekilde tasarlanmıştır. Projede SSO mantığı 
uygulanmıştır. Bir kere giriş yaptığımızda yetkimiz olan her siteye tekrar giriş yapmadan erişim sağlayabiliyoruz. Bunu da paylaşılan cookie'lere token'lar 
kaydetip, her aşamada bu token'ı verify ederek yapıyoruz. Token'nın olmadığı veya geçersiz olduğu durumlarda login sayfasına yönlendirip login işlemi yapılıp geri 
yönlendirilmektedir.


