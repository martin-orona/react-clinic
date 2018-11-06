:: reference article to run HSQLDB
:: http://nikolaiklimov.de/query-java-HyperSQL-database-with-csharp/
::
:: command line sample in article
:: java -cp ..\hsqldb-2.4.1\hsqldb\lib\hsqldb.jar org.hsqldb.server.Server ? --database.0 file:mydb --dbname.0 xdb --port 9999
::
::hsqldb.jar command line parameter:
::    file - database file name on disk. HSQLDB creates a few files with base name mydb.* with these extensions: *.lock, *.data, *.properties, *.script
::    dbname.0 - alias name to use in Connection String.
::
::The database listens by default on port 9001 for new connections. We specified the port 9999 on the command line. 

java -cp .\hsqldb-2.4.1\hsqldb\lib\hsqldb.jar org.hsqldb.server.Server ? --database.0 file:database\petclinicdb --dbname.0 pcdb

