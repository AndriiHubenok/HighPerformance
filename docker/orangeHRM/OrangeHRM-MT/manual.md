## Installation OrangeHRM (Multi-Tenant Prototyp)

1. Installation der Basisanwendung
- Datenbank manuell Anlegen
- Owner des OrangeHRM-Ordner's auf 'www-data' ändern (chown -R www-data.www-data orangehrm) für Schreibzugang des Installers
- Webinstaller ausführen
- Erstmalige Anmeldung

2. Datenbank anpassen
- Auführen der SQL Anweisungen 'OrangeHRM Database Changes.sql'

3. Neue oder veränderte Dateien kopieren
- Dateien befinden sich im Ordner 'symfony'

1. Composer Classloader cache neu laden:
    ```
    composer install -d symfony/lib
    composer dump-autoload -o -d symfony/lib
    ```

2. Symfony cache löschen:
    ```
    cd /var/www/symfony
    php symfony cc
    ```
   
3. Tenantadmin erstellen
- siehe 'FAQ Tenantadmin.txt'

FERTIG
