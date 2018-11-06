:: reference article to run HSQLDB
:: http://nikolaiklimov.de/query-java-HyperSQL-database-with-csharp/
::

.\hsqldb-2.4.1\hsqldb\lib\hsqldb.jar

::Manually checking connection to database
::
::To check the connection we will start HSQL Database Manager
::
::The jar file hsqldb.jar contains a JDBC driver and a GUI query tool at the same time. Nice!
::
::To start HSQL Database Manager double-click on hsqldb-2.4.1\hsqldb\lib\hsqldb.jar.
::
::The 'Connect' dialog of the HSQL Database Manager should pop up.
::
::Type in this connection string in field URL: jdbc:hsqldb:hsql://localhost:9999/xdb
:: :9999 is needed if the server is running on a port other than the default 9001
::   e.g. command line parameter --port 9999
:: xdb is the alias of the database, as reported by the server when starting up
::   e.g. command line parameter --dbname.0 xdb
::
::Choose in field Type: HSQL Database Engine Server
::
::Let field Password empty
::
::Click on OK
